import { Box, Heading } from '@chakra-ui/react'
import React, { useEffect, useState } from "react";
import { BarChart, ColumnChart, LineChart, PieChart } from 'react-chartkick'

const Main = () => {

    const [bestSellers, setBestSellers] = useState([]);
    
      useEffect(() => {
      fetch("http://localhost:3000/cart/bestsellers")
        .then((res) => res.json())
        .then((data) => {
          
          setBestSellers(data.data);
          //setFilteredProducts(data.data);
          console.log("DATA", data.data);
          //console.log("PRODUCTS", products);
        })
        .catch((err) => {
          console.error("Error cargando productos:", err);
          Swal.fire({ title: "Error", text: err, icon: "error" })
          .then(() => {
            location.reload();
          });
        });
    }, []);

  return (
    <Box>
      <Heading size='xl'>Productos más vendidos</Heading>

        {/* <ColumnChart data={
          [
            ["Sun", 32],
            ["Mon", 46],
            ["Tue", 28]
          ]
          } /> */}
        
          {
            bestSellers.map((prod) => (
              console.log(prod.totalSold),
              console.log(prod.product.name)
            ))
          }

          <ColumnChart
            data={bestSellers.map((prod) => [
              prod.product.name,
              Number(prod.totalSold)
            ])}
          />

        


        {/* <LineChart data={{"2025-01-01": 11, "2025-01-02": 6}} />
        <BarChart data={[["Work", 32], ["Play", 1492]]} /> */}
    </Box>
  )
}

export default Main
