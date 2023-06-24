import React, { useState } from 'react'
import './Form.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Form = () => {

  const [data, setData] = useState({
    state_name: "",
    population_male: "",
    population_female: "",
    literates_male: "",
    literates_female: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "http://localhost:5000/data";
      const { data: res } = await axios.post(url, data);
      // .then(res => console.log(res.data));
      // console.log(res.message);
      // alert("Data Uploaded Successfully")
      navigate("/dashboard");
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      }
    }
  };

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', selectedFile);
    // console.log(formData)

    axios.post('http://localhost:5000/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => {
      // console.log(response);
      navigate("/dashboard");
    })
    .catch((error) => {
      console.error('Error uploading file:', error);
    });
  };

  return (
    <>
      <div className="signup_container">
        <div className="signup_form_container">
          <div className="right">
            <h2>Enter the Details</h2>
            <form className="form_container" onSubmit={handleUpload}>
              <input
                type="file"
                placeholder="Upload File"
                name="file"
                onChange={handleFileChange}
                required
                className="input"
                />
              <button type="submit" className="green_btn">
                Upload
              </button>
            </form>
            <h3>OR</h3>
            <form className="form_container" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Name of the State"
                name="state_name"
                onChange={handleChange}
                value={data.state_name}
                required
                className="input"
              />
              <input
                type="number"
                placeholder="Male Population"
                name="population_male"
                onChange={handleChange}
                value={data.population_male}
                required
                className="input"
              />
              <input
                type="number"
                placeholder="Female Population"
                name="population_female"
                onChange={handleChange}
                value={data.population_female}
                required
                className="input"
              />
              <input
                type="number"
                placeholder="Male Literates"
                name="literates_male"
                onChange={handleChange}
                value={data.literates_male}
                required
                className="input"
              />
              <input
                type="number"
                placeholder="Female Literates"
                name="literates_female"
                onChange={handleChange}
                value={data.literates_female}
                required
                className="input"
              />
              {error && <div className="error_msg">{error}</div>}
              <button type="submit" className="green_btn">
                Push Data
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default Form