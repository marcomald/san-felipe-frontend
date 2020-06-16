import React from "react";
// used for making the prop types of this component
import PropTypes from "prop-types";
import XLSX from 'xlsx';
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
        if (file) {
            reader.onloadend = async (event) => {
                const data = reader.result;
                const workBook = XLSX.read(data, { type: 'binary', cellDates: true });
                const jsonData = await workBook.SheetNames.reduce((initial, name) => {
                    const sheet = workBook.Sheets[name];
                    initial["data"] = XLSX.utils.sheet_to_json(sheet);
                    return initial;
                }, {});
                setFile(file);
                props.handleFile({file:jsonData, name: file.name})
                setLoading(false)
            }
            reader.readAsBinaryString(file);
        } else {
            setLoading(false)
        }
    };

    const handleClick = () => {
        fileInput.current.click();
    };

    const handleRemove = () => {
        setFile(null);
        fileInput.current.value = null;
        props.handleFile([])
    };

    let { avatar, addButtonProps, changeButtonProps, removeButtonProps, disabled } = props;
    return (
        <div className="fileinput text-center">
            <input
                disabled={disabled ? disabled : false}
                type="file"
                onChange={handleImageChange}
                ref={fileInput}
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" />
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
