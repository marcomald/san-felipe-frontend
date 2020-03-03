import React from "react";
import GridContainer from "components/Grid/GridContainer.js";
// import GridItem from "components/Grid/GridItem.js";
import AdminLayout from "../../layouts/Admin"

export default function ErrorPage() {
    // const user = window.sessionStorage.getItem("user")
    // const userDecode = JSON.parse(window.atob(user));
    return (
        <AdminLayout>
            <div>
                <GridContainer>
                    <h1>INICIO</h1>
                    {/* <hr />
                    <GridItem md={12}>
                        <h1>Bienvenido! </h1>
                        <h2>{userDecode.userName}</h2>
                    </GridItem> */}
                </GridContainer>
            </div>
        </AdminLayout>
    );
}
