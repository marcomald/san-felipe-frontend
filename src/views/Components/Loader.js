import React from "react";
import { makeStyles } from "@material-ui/core/styles";
// Spinner Loader
import Loader from 'react-loader-spinner'

const customStyles = {
    modal: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        position: "fixed",
        zIndex: 10,
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        overflow: "auto",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
    },
};
const useStyles = makeStyles(customStyles);
export default function LoaderComponent(props) {
    const classes = useStyles();
    console.log("show ==>", props.show);
    return (<>
        <h1>HOLLLLLLLLLLLLLLLLLLLLa</h1>
        <div className={classes.modal}>
            <div>
                <Loader
                    visible={true}
                    type="TailSpin"
                    color="#00BFFF"
                    height={100}
                    width={100}
                />
            </div>
        </div>
    </>)
    // if (props.show === true) {
    //     console.log("ENTROOO")
    //     return (<>
    //         <h1>HOLLLLLLLLLLLLLLLLLLLLa</h1>
    //         <div className={classes.modal}>
    //             <div>
    //                 <Loader
    //                     visible={props.show}
    //                     type="TailSpin"
    //                     color="#00BFFF"
    //                     height={100}
    //                     width={100}
    //                 />
    //             </div>
    //         </div>
    //     </>)
    // } else {
    //     return (
    //         <></>
    //     )
    // }
}