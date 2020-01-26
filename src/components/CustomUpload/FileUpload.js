import React from "react";
// used for making the prop types of this component
import PropTypes from "prop-types";
import readXlsxFile from 'read-excel-file'
import Loader from 'components/Loader/Loader.js'

// core components
import Button from "components/CustomButtons/Button.js";

export default function FileUpload(props) {
    const [file, setFile] = React.useState(null);
    const [loading, setLoading] = React.useState(false)
    let fileInput = React.createRef();

    const handleImageChange = e => {
        setLoading(true)
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];
        readXlsxFile(file).then((rows) => {
            props.handleFile(rows)
            setLoading(false)
        })

        reader.onloadend = () => {
            setFile(file);
        };
        reader.readAsDataURL(file);
    };
    // eslint-disable-next-line
    const handleSubmit = e => {
        e.preventDefault();
        // file is the file/image uploaded
        // in this function you can save the image (file) on form submit
        // you have to call it yourself
    };

    const handleClick = () => {
        fileInput.current.click();
    };

    const handleRemove = () => {
        setFile(null);
        fileInput.current.value = null;
        props.handleFile([])
    };

    let { avatar, addButtonProps, changeButtonProps, removeButtonProps } = props;
    return (
        <div className="fileinput text-center">
            <input type="file" onChange={handleImageChange} ref={fileInput} accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" />
            <h4>{file && file.name}</h4>
            <div>
                {file === null ? (
                    <Button {...addButtonProps} onClick={() => handleClick()}>
                        {avatar ? "Add Photo" : "Seleccionar archivo"}
                    </Button>
                ) : (
                        <span>
                            <Button {...changeButtonProps} onClick={() => handleClick()}>
                                Modificar
                            </Button>
                            <Button {...removeButtonProps} onClick={() => handleRemove()}>
                                <i className="fas fa-times" /> Eliminar
                            </Button>
                        </span>
                    )}
            </div>
            {loading && <Loader show={loading} />}
        </div>
    );
}

FileUpload.propTypes = {
    avatar: PropTypes.bool,
    addButtonProps: PropTypes.object,
    changeButtonProps: PropTypes.object,
    removeButtonProps: PropTypes.object
};
