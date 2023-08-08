from fastapi import APIRouter, Query, Response
from pydantic import BaseModel
from typing import List, Union
import io
import csv
import random
router = APIRouter()


class FakeData(BaseModel):
    index: int
    id: str
    fio: str
    address: str
    phone: str


def introduce_errors(data: dict, error_count: float, seed: int, region: str) -> dict:
    random.seed(seed)
    alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    russian_alphabet = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя"
    polish_alphabet = "aąbcćdeęfghijklłmnńoópqrsśtuvwxyzźż"

    if region == 'USA':
        used_alphabet = alphabet
    elif region == 'Poland':
        used_alphabet = polish_alphabet
    else:
        used_alphabet = russian_alphabet

    def add_error(s):
        choice = random.choice([1, 2, 3])
        if choice == 1 and len(s) > 0:
            pos = random.randint(0, len(s) - 1)
            s = s[:pos] + s[pos + 1:]
        elif choice == 2:
            pos = random.randint(0, len(s))
            char = random.choice(used_alphabet)
            s = s[:pos] + char + s[pos:]
        elif choice == 3 and len(s) > 1:
            pos = random.randint(0, len(s) - 2)
            s = s[:pos] + s[pos + 1] + s[pos] + s[pos + 2:]

        return s

    if 'index' in data:
        index_value = data.pop('index')

    for _ in range(int(error_count)):
        random_key = random.choice([key for key in data])
        data[random_key] = add_error(data[random_key])

    data['index'] = index_value

    return data


def generate_fake_data(seed: int, count: int, page: int, last_index, region: str, update: int, errors):
    from faker import Faker
    if region == 'USA':
        fake = Faker('en-US')
    elif region == 'Poland':
        fake = Faker('pl-PL')
    else:
        fake = Faker('ru-RU')
    Faker.seed(seed)
    fake_data = []
    if update == 3:
        for i in range(0, 20):
            fake_data.append(
                introduce_errors(data={'index': i + 1, 'id': fake.ssn(), 'fio': fake.name(), 'address': fake.address(), 'phone': fake.phone_number()}, error_count=errors, seed=seed + i, region=region))
        return fake_data
    elif update == 0:
        last_index = last_index if last_index != 0 else 20

        for i in range(0, last_index):
            fake_data.append(
                introduce_errors(data={'index': i + 1, 'id': fake.ssn(), 'fio': fake.name(), 'address': fake.address(), 'phone': fake.phone_number()}, error_count=errors, seed=seed + i, region=region))
        return fake_data
    else:
        last_index = last_index if last_index != 0 else 20

        for i in range(0, last_index + 10):
            fake_data.append(
                introduce_errors(data={'index': i + 1, 'id': fake.ssn(), 'fio': fake.name(), 'address': fake.address(), 'phone': fake.phone_number()}, error_count=errors, seed=seed + i, region=region))
        return fake_data


@router.get("/")
def get_fake_data(seed: int = Query(None), page: int = Query(None), count: int = Query(None), last_index: int = Query(None), region: str = Query(None), update: int = Query(None), errors: Union[float, int] = Query(None)):
    fake_data = generate_fake_data(
        seed=seed, page=page, count=count, last_index=last_index, region=region, update=update, errors=errors)
    return fake_data


@router.post("/csv")
def get_fake_data(data: List[FakeData]):
    csv_buffer = io.StringIO()

    csv_writer = csv.writer(csv_buffer)
    csv_writer.writerow(
        ["Index", "ID", "FIO", "Address", "Phone"])

    for item in data:
        address_with_newlines_replaced = item.address.replace("\n", "\\n")
        csv_writer.writerow([item.index, item.id, item.fio,
                            address_with_newlines_replaced, item.phone])

    csv_buffer.seek(0)

    response = Response(content=csv_buffer.getvalue(), media_type="text/csv")
    response.headers["Content-Disposition"] = "attachment; filename=data.csv"

    return response
