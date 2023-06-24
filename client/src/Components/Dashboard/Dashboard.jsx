import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Chart from "chart.js/auto";
import { Bar , Pie } from "react-chartjs-2";
import { Link } from "react-router-dom";

const Dashboard = () => {

  const [showButton, setShowButton] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();  
    try {
      setShowButton(!showButton);
      const url = "http://localhost:5000/process";
      const data = await axios.post(url);
      // .then(res => console.log(res.data));
      // console.log("Data Processed succesfully");
      window.location.reload(true);
    } catch (error) {
      console.log(error)
    }
  };
  
  const [values,setvalues]=useState([]);

  useEffect(()=>{
    fetch("http://localhost:5000/data")
    .then((data)=>data.json())
    .then((val)=>setvalues(val))
  },[])

  // console.log(values)


  const data = {
    labels: values.map((v)=>v.state_name),
    datasets: [
      {
        label: "Total Population of individual state",
        backgroundColor: "#FFA500",
        borderColor: "#FFA500",
        data: values.map((v)=>v.total_population),
      },
    ],
  };
  
  const data1 = {
    labels: values.map((v)=>v.state_name),
    datasets: [
      {
        label: "Male Population in each state",
        backgroundColor: "#FFA500",
        borderColor: "#FFA500",
        data: values.map((v)=>v.population_male
        ),
      },
      {
        label: "Female Population in each state",
        backgroundColor: "#48ff00",
        borderColor: "#FFA500",
        data: values.map((v)=>v.population_female
        ),
      }
    ],
  };

  const data2 = {
    labels: values.map((v)=>v.state_name),
    datasets: [
      {
        label: "Graduates in each state",
        backgroundColor:[
          "#FF3F34",
          "#FF681F",
          "#FF9933",
          "#FFBF00",
          "#FFD700",
          "#C2B280",
          "#E5E4E2",
          "#CC7722",
          "#006400",
          "#3CB371",
          "#FF7F50",
          "#228B22",
          "#9ACD32",
          "#FFD700",
          "#800080",
          "#8B4513",
          "#FFC0CB",
          "#FF00FF",
          "#FFD700",
          "#FF4500",
          "#FF0000",
          "#4682B4",
          "#008000",
          "#FFA500",
          "#9932CC",
          "#800000",
          "#87CEEB",
          "#008080",
          "#000080"
        ],
        borderColor: [
          "#FF3F34",
          "#FF681F",
          "#FF9933",
          "#FFBF00",
          "#FFD700",
          "#C2B280",
          "#E5E4E2",
          "#CC7722",
          "#006400",
          "#3CB371",
          "#FF7F50",
          "#228B22",
          "#9ACD32",
          "#FFD700",
          "#800080",
          "#8B4513",
          "#FFC0CB",
          "#FF00FF",
          "#FFD700",
          "#FF4500",
          "#FF0000",
          "#4682B4",
          "#008000",
          "#FFA500",
          "#9932CC",
          "#800000",
          "#87CEEB",
          "#008080",
          "#000080"
        ],
        data: values.map((v)=>v.total_literates),
      },
    ],
  };


  return (
    <>
      <div style={{marginLeft:500}}>
        <Link to={"/"}>
          <button type="submit" className="btn">BACK</button>
        </Link>
        <button type="submit" onClick={handleSubmit} className="btn">PROCESS DATA</button>
      </div>
        <div style={{ width: 1150, marginLeft: 170, marginTop:50, textAlign: "center" }}>
          <Bar data={data1} />
        </div>

        <div style={{ width: 1150, marginLeft: 170, marginTop:50, textAlign: "center" }}>
          <Bar data={data} />
        </div>
        <h2 style={{textAlign:'center'}}>Graduates in each state</h2>
        <div style={{ width: 650, marginLeft: 450, marginTop:50,marginBottom:60, textAlign: "center" }}>
          <Pie data={data2} />
        </div>
    </>
  )
}

export default Dashboard