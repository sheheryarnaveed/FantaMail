import React from 'react';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import './App.css';
import ReactDOM from 'react-dom';
import $ from 'jquery'

import DeleteIcon from '@material-ui/icons/Delete';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

var numberNotChecked = 0;


/**
 * A simple table demonstrating the hierarchy of the `Table` component and its sub-components.
 */
class Inboxed extends React.Component {
    constructor() {
    super();

    this.state = { checked: false, numberNotChecked: "0" };
    this.handleChange = this.handleChange.bind(this);
    }
   
    handleChange() {

        numberNotChecked = $('input:checkbox:checked').length;
       this.setState({
           numberNotChecked: numberNotChecked
       })

    }

    render() {
        const content = this.state.checked
            ? <div> Content </div>
            : null;

        
        const abc = 
            this.state.numberNotChecked > 0
               ? <Tooltip title="Delete">

                    <IconButton color="inherit" aria-label="Delete" >
                        <DeleteIcon />
                    </IconButton>
                </Tooltip> : <Tooltip title="Delete">

                    <IconButton color="inherit" aria-label="Delete" disabled="true">
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
        ;
        

        const { classes } = this.props;
        const { selected } = this.state;

        return (
           

            
            <div id="email">
                <table border="0" >
                    <tr>
                        <td style={{ width: "5%" }}>
                            <input type="checkbox"
                                onChange={this.handleChange}/>
                        </td>
                        <td style={{ width: "20%" }}>
                            foo@foo.com
                    </td>
                        <td style={{ width: "50%" }}>
                            How are you doing?
                    </td>
                        <td style={{ width: "25%" }}>
                            12th November 2018
                    </td>
                    </tr>

                    <tr>
                        <td style={{ width: "5%" }}>
                            <input type="checkbox" 
                                onChange={this.handleChange}/>
                        </td>
                        <td style={{ width: "20%" }}>
                            foo@foo.com
                    </td>
                        <td style={{ width: "50%" }}>
                            How are you doing?
                    </td>
                        <td style={{ width: "25%" }}>
                            12th November 2018
                    </td>
                    </tr>

                    <tr>
                        <td style={{ width: "5%" }}>
                            <input type="checkbox" onChange={this.handleChange}/>
                        </td>
                        <td style={{ width: "20%" }}>
                            foo@foo.com
                    </td>
                        <td style={{ width: "50%" }}>
                            How are you doing?
                    </td>
                        <td style={{ width: "25%" }}>
                            12th November 2018
                    </td>
                    </tr>
                </table>
            </div>
        );
    }

}



export default Inboxed;