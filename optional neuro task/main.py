import os
import cv2
from tensorflow.keras.datasets import mnist
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Flatten
from tensorflow.keras.utils import to_categorical
import numpy as np
from collections import Counter
from tqdm import tqdm


images_folder = "path"

(train_images, train_labels), (_, _) = mnist.load_data()

train_images = train_images.reshape((60000, 28, 28, 1))
train_images = train_images.astype('float32') / 255
train_labels = to_categorical(train_labels)

model = Sequential()
model.add(Flatten(input_shape=(28, 28, 1)))
model.add(Dense(128, activation='relu'))
model.add(Dense(10, activation='softmax'))
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
model.fit(train_images, train_labels, epochs=5, batch_size=64)

def recognize_handwritten_digit(image_path):
    image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    resized_image = cv2.resize(image, (28, 28))
    handwritten_digit = np.expand_dims(resized_image, axis=0)
    handwritten_digit = handwritten_digit.astype('float32') / 255

    prediction = model.predict(handwritten_digit)
    predicted_class = np.argmax(prediction)

    return predicted_class

def extract_numbers_from_images(folder_path):
    extracted_numbers = []

    image_files = [file for file in os.listdir(folder_path) if file.endswith((".jpg", ".png", ".jpeg"))]

    for image_file in tqdm(image_files):
        image_path = os.path.join(folder_path, image_file)
        recognized_digit = recognize_handwritten_digit(image_path)
        extracted_numbers.append(recognized_digit)

    return extracted_numbers

numbers = extract_numbers_from_images(images_folder)
print('Кол-во цифр,', len(numbers))
digit_counts = Counter(numbers)

for digit, count in digit_counts.items():
    print(f"Цифра {digit}: {count} раз")
