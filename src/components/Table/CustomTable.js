import React, { useState } from "react";

import Table from "components/Table/Table.js";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Pagination from "components/Pagination/Pagination.js";
import CustomInput from "components/CustomInput/CustomInput";

import { makeStyles } from "@material-ui/core/styles";
import FormStyles from "assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.js";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import {
    ContainerLimitTable,
    ContainerInputSearch,
    ContainerSelectLimit,
} from "./style"

const useStylesForm = makeStyles(FormStyles);
const limitForPage = [1, 2, 3, 4, 10, 20]

export default function CustomTable(props) {
    const {
        limite,
        data,
        headers,
        total,
        changeLimit,
        offset,
        onOffsetChange,
        onSearchChange,
        searchValue,
        placeholderSearch,
        labelSearch,
        showSearch
    } = props
    const [limit, setLimit] = useState(limite ? limite : 5)

    const FormClasses = useStylesForm();
    const pagination = [
        { text: "PREV" },
        { text: "NEXT" }
    ];
    const onClickPagination = (id) => {
        let offsetAux
        switch (id) {
            case "PREV":
                offsetAux = +offset - limit;
                if (offsetAux < 0) {
                    offsetAux = 0;
                }
                onOffsetChange(offsetAux);
                break
            case "NEXT":
                if (+offset + data.length >= total) {
                    onOffsetChange(offset);
                    return;
                }
                offsetAux = +offset + limit;
                if (offsetAux >= total) {
                    offsetAux = (+offset + limit) - total;
                }
                onOffsetChange(offsetAux);
                break
            default:
                break
        }

    }

    const onChangeLimit = (valueLimit) => {
        setLimit(valueLimit)
        changeLimit(valueLimit)
    }

    return (<React.Fragment>
        <div>

            <ContainerLimitTable >
                <ContainerSelectLimit>
                    <FormControl
                        fullWidth
                        className={FormClasses.selectFormControl}
                    >
                        <InputLabel
                            htmlFor="limit-select"
                            className={FormClasses.selectLabel}
                        >
                            Registros por pagina
                    </InputLabel>
                        <Select
                            MenuProps={{
                                className: FormClasses.selectMenu,
                            }}
                            classes={{
                                select: FormClasses.select
                            }}
                            value={limit}
                            onChange={(e) => onChangeLimit(e.target.value)}
                            inputProps={{
                                name: "limitSelect",
                                id: "limit-select"
                            }}
                        >
                            <MenuItem
                                disabled
                                classes={{
                                    root: FormClasses.selectMenuItem
                                }}
                            >
                                Eliga una opcion
                                </MenuItem>
                            {
                                limitForPage.map((limitOption, index) => {
                                    return (
                                        <MenuItem
                                            key={index}
                                            classes={{
                                                root: FormClasses.selectMenuItem,
                                                selected: FormClasses.selectMenuItemSelected
                                            }}
                                            value={limitOption}
                                        >
                                            {limitOption}
                                        </MenuItem>
                                    )
                                })
                            }
                        </Select>
                    </FormControl>
                </ContainerSelectLimit>
                <ContainerInputSearch>
                    {showSearch &&
                        <CustomInput
                            labelText={labelSearch}
                            id="name_seller_search"
                            formControlProps={{
                                fullWidth: true,

                            }}
                            inputProps={{
                                type: "text",
                                placeholder: placeholderSearch,
                            }}
                            value={searchValue}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                    }
                </ContainerInputSearch>
            </ContainerLimitTable>
        </div>

        <Table
            striped
            tableHeaderColor="primary"
            tableHead={headers}
            tableData={data}
        />
        <div>
            {data.length === 0 && <small>No existen datos ingresados.</small>}
        </div>
        <Pagination
            pages={pagination}
            color="primary"
            onclickButton={onClickPagination}
        />
    </React.Fragment>)
}
