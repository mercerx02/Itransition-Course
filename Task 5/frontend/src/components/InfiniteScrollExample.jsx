import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { saveAs } from 'file-saver';



const FakeDataGenerator = () => {

  const [page, setPage] = useState(1)
  const [data, setData] = useState([])
  const [region, setRegion] = useState('USA');
  const [sliderValue, setSliderValue] = useState(0);
  const [inputValue, setInputValue] = useState(0);
  const [seed, setSeed] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`http://localhost:8000/fake?seed=${seed}&page=0&count=20&last_index=0&region=${region}&update=3&errors=${inputValue}`);
        const data = await response.json();
        setData(data)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);


  const fetchMoreData = async () => {
    try {
      const response = await fetch(`http://localhost:8000/fake?seed=0&page=${page}&count=10&last_index=${data.length}&region=${region}&update=0&errors=${inputValue}`);
      const newData = await response.json();
      setData(prevData => [...prevData, ...newData]);
      setPage(prevPage => prevPage + 1);
    } catch (error) {
      console.error('Error fetching more data:', error);
    }
  };
  useEffect(()=>{
    async function fetchData() {
      try {
        const response = await fetch(`http://localhost:8000/fake?seed=${seed}&page=0&count=20&last_index=${data.length}&region=${region}&update=1&errors=${inputValue}`);
        const data2 = await response.json();
        setData(data2)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();

  },[inputValue, region, seed])

  useEffect(() => {
    setSliderValue(Math.min(inputValue / 100, 10));
  }, [inputValue]);

  const handleSliderChange = (e) => {
    const value = parseFloat(e.target.value);
    setSliderValue(value);
    setInputValue(value * 100);
  };

  const handleInputBlur = () => {
    setInputValue(Math.min(inputValue, 1000));
    setSliderValue(Math.min(inputValue / 100, 10));
  };

  const exportToCsv = async () => {
    try {
      const response = await fetch('http://localhost:8000/fake/csv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const blob = await response.blob();
      const text = await blob.text();

      const blobCsv = new Blob([text], { type: 'text/csv' });
      saveAs(blobCsv, 'data.csv');
    } catch (error) {
      console.error('Error sending data:', error);
    }

  }

  return (
    <div>
      <div className="container mt-4">
        <div className="row mb-3">
          <div className="col-md-4">
            <label htmlFor="region" className="form-label">Выберите регион:</label>
            <select
              id="region"
              className="form-select"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            >
              <option value="USA">USA</option>
              <option value="Poland">Poland</option>
              <option value="Russia">Russia</option>
            </select>
          </div>
          <div className="col-md-4">
            <label htmlFor="errorCount" className="form-label">Выберите количество ошибок на одну запись:</label>
            <input
              type="range"
              className="form-range"
              id="errorCount"
              min={0}
              max={10}
              step={0.01}
              value={sliderValue}
              onChange={handleSliderChange}
            />
            <input
              type="number"
              className="form-control mt-2"
              min={0}
              max={1000}
              value={inputValue}
              onChange={(e) => setInputValue(parseFloat(e.target.value))}
              onBlur={handleInputBlur}
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="seed" className="form-label">Введите seed:</label>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                id="seed"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
              />
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => setSeed(Math.floor(Math.random() * 1000))}
              >
                Случайный seed
              </button>
            </div>
          </div>
          <div className="col-md-4">
          <button className="btn btn-primary" onClick={()=>exportToCsv()}>
            Экспорт в CSV
          </button>
        </div>
        </div>
      </div>


    <InfiniteScroll dataLength={data.length} next={fetchMoreData} hasMore={true}>
    <div className="container">
    <div className="row justify-content-center">
      <div className="col-md-6 mt-5">
        <div className="scrollable-div">
          <table className="table table-dark">
            <thead>
              <tr>
                <th>Номер</th>
                <th>Айди</th>
                <th>ФИО</th>
                <th>Адрес</th>
                <th>Телефон</th>

              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{item.index}</td>
                  <td>{item.id}</td>
                  <td>{item.fio}</td>
                  <td>{item.address}</td>
                  <td>{item.phone}</td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  </InfiniteScroll>
  </div>

  );
};

export default FakeDataGenerator;
