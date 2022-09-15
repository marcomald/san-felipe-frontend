import React from "react";
// import GridItem from "components/Grid/GridItem.js";
import AdminLayout from "../../layouts/Admin";
import sanFelipeImgBg from "assets/img/san-felipe-bg2.jpeg";

export default function HomePage() {
  return (
    <AdminLayout>
      <div>
        <div>
          <img
            style={{
              width: "100%",
              paddingTop: "2rem",
              objectFit: "cover",
              maxHeight: "90vh"
            }}
            src={sanFelipeImgBg}
            alt="San Felipe Fondo"
          />
        </div>
      </div>
    </AdminLayout>
  );
}
