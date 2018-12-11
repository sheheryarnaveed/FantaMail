import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import FlagIcon from '@material-ui/icons/Flag';
import MailIcon from '@material-ui/icons/Mail';
import DeleteIcon from '@material-ui/icons/Delete';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import Tooltip from '@material-ui/core/Tooltip';

import IconButton from '@material-ui/core/IconButton';
import ArrowLeft from '@material-ui/icons/ArrowLeft';
import ArrowRight from '@material-ui/icons/ArrowRight';
import ArrowLeftAltRounded from '@material-ui/icons/ArrowBack';
import InputBase from '@material-ui/core/InputBase';
import { fade } from '@material-ui/core/styles/colorManipulator';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import logo from './assets/fantamail_logo.svg';
import './App.css';
import $ from 'jquery';


const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex',
    },
    grow: {
        flexGrow: 0.1,
  },
    grow2: {
        flexGrow: 1,
    },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
  },
  toolbar: theme.mixins.toolbar,
  search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
          backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginLeft: 1,
      width: 'auto',
      [theme.breakpoints.up('sm')]: {
          marginLeft: theme.spacing.unit,
          width: 'auto',
      },
  },
  searchIcon: {
      width: theme.spacing.unit * 9,
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
  },
  simpleIcon: {
      alignItems: 'right',
      justifyContent: 'space-between',
  },
  inputRoot: {
      color: 'inherit',
      width: '100%',
  },
  inputInput: {
      paddingTop: theme.spacing.unit,
      paddingRight: theme.spacing.unit,
      paddingBottom: theme.spacing.unit,
      paddingLeft: theme.spacing.unit * 10,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
          width: 300,
          '&:focus': {
              width: 400,
          },
      },
  },
});

var numberNotChecked = 0;
var pagenum = 0;
var trindex = 0;
var maxrows = 3;
var table = "#mytable";
var totalrows = 0;
var back = 0;
var forward = 0;
var inside = 0;
var email_id = 0;
var curr_folder = "Inbox";


class ClippedDrawer extends React.Component {
    constructor(props) {
        super(props);
        this.state = { selected: 0, prev: -1, checked: false, numberNotChecked: "0", forward: "0", back: "0", emailbody: [], Inbox: [], Trash: [], Important: []};
        this.handleChange = this.handleChange.bind(this);
    }


    
    componentDidMount() {
        this.fetchData();
        //this.handlepageforward();
    }

    fetchData() {
        fetch('http://localhost:81/InboxDisplay.php')
            .then(results => results.json())
            .then(results => this.setState({ Inbox: results }, () => {
                totalrows = this.state.Inbox.length;
                this.handlepageforward();
            }));
        fetch('http://localhost:81/ImportantDisplay.php')
            .then(results => results.json())
            .then(results => this.setState({ Important: results }, () => {
            }));
        fetch('http://localhost:81/TrashDisplay.php')
            .then(results => results.json())
            .then(results => this.setState({ Trash: results }, () => {
            }));
        
    }

    updateShift() {
        inside = 0;
        pagenum--;
        this.updatehandlers();
        if (forward > 0) {
            pagenum--;
        }
        
        this.handlepageforward();
    }
    
    Delete() {
        var that = this;
        var index = $('input[type=checkbox]:checked').val();
        $('input[type=checkbox]:checked').each(function () {
            var ip = 'http://localhost:81/Delete.php?' + curr_folder + '=' + index;
            this.checked = false;
            totalrows--;
            $.ajax({
                type: "GET",
                url: ip,
                dataType: "json",
                success: function (data) {
                    
                    numberNotChecked = 0;
                    if (curr_folder == "Inbox") {
                        that.setState({
                            Inbox: data
                        })
                    }
                    else if (curr_folder == "Important") {
                        that.setState({
                            Important: data
                        })
                    }
                    that.setState({
                        numberNotChecked: 0
                    })
                    fetch('http://localhost:81/TrashDisplay.php')
                        .then(results => results.json())
                        .then(results => that.setState({ Trash: results }, () => {
                        }));
                },
                error: function (data) {
                    alert("Could not fetch the data!");
                }

            });
            
        });
        this.updateShift();
    }

    MovetoIMP() {
        var that = this;
        var index = $('input[type=checkbox]:checked').val();
        $('input[type=checkbox]:checked').each(function () {
            var ip = 'http://localhost:81/MovetoIMP.php?' + curr_folder + '=' + index;
            this.checked = false;
            totalrows--;
            $.ajax({
                type: "GET",
                url: ip,
                dataType: "json",
                success: function (data) {

                    numberNotChecked = 0;
                    if (curr_folder == "Inbox") {
                        that.setState({
                            Inbox: data
                        })
                    }
                    else if (curr_folder == "Trash") {
                        that.setState({
                            Trash: data
                        })
                    }
                    that.setState({
                        numberNotChecked: 0
                    })
                    fetch('http://localhost:81/ImportantDisplay.php')
                        .then(results => results.json())
                        .then(results => that.setState({ Important: results }, () => {
                        }));
                },
                error: function (data) {
                    alert("Could not fetch the data!");
                }

            });

        });
        this.updateShift();
    }

    MovetoINB() {
        var that = this;
        var index = $('input[type=checkbox]:checked').val();
        $('input[type=checkbox]:checked').each(function () {
            var ip = 'http://localhost:81/MovetoINB.php?' + curr_folder + '=' + index;
            this.checked = false;
            totalrows--;
            $.ajax({
                type: "GET",
                url: ip,
                dataType: "json",
                success: function (data) {

                    numberNotChecked = 0;
                    if (curr_folder == "Important") {
                        that.setState({
                            Important: data
                        })
                    }
                    else if (curr_folder == "Trash") {
                        that.setState({
                            Trash: data
                        })
                    }
                    that.setState({
                        numberNotChecked: 0
                    })
                    fetch('http://localhost:81/InboxDisplay.php')
                        .then(results => results.json())
                        .then(results => that.setState({ Inbox: results }, () => {
                        }));
                },
                error: function (data) {
                    alert("Could not fetch the data!");
                }

            });

        });
        this.updateShift();
    }

    handleChange() {
        numberNotChecked = $('input:checkbox:checked').length;
        this.setState({
            numberNotChecked: numberNotChecked
        })
        
    }

    handleBack(Selec, prevIndex) {
        inside = 0;
        this.setState({
            selected: prevIndex,
            prev: Selec
        }, () => {
            pagenum = pagenum - 1;
            this.handlepageforward();
        });
    }

    updateSelected(selectedIndex, prevIndex) {
        this.setState({ selected: selectedIndex, prev: prevIndex }, () => {
            if (selectedIndex == 0) {
                curr_folder = "Inbox";
                table = "#mytable";
                totalrows = this.state.Inbox.length;
            }
            else if (selectedIndex == 1) {
                curr_folder = "Important";
                table = "#mytable1";
                totalrows = this.state.Important.length;
            }
            else if (selectedIndex == 2) {
                curr_folder = "Trash";
                table = "#mytable2";
                totalrows = this.state.Trash.length;
            }
            if (selectedIndex < 4) {
                pagenum = 0;
                inside = 0;
                this.handlepageforward();
            }
            this.handleChange();
        });
    }

    manageemails(id) {
        //totalrows = this.state.Inbox.length;
        if (id != totalrows) {
            forward = 0;
        }
        else {
            forward = 1;
        }
        if (id>1) {
            back = 0;
        }
        else {
            back = 1;
        }
        this.setState({
            forward: forward,
            back: back
        })
    }

    handlepagebackwards() {
        $('input[type=checkbox]:checked').each(function () {
            this.checked = false;
        });
        this.handleChange();
        if (inside) {
            this.openmail(parseInt(email_id)-1, curr_folder);
        }
        else {
            pagenum--;
            trindex = 0;
            $(table + ' tr:gt(0)').each(function () {
                trindex++;
                if (trindex > (maxrows * pagenum) || trindex <= ((maxrows * pagenum) - maxrows)) {
                    $(this).hide();
                }
                else {
                    $(this).show();
                }

            });
            this.updatehandlers();
        }
        
    }

    handlepageforward() {
        $('input[type=checkbox]:checked').each(function () {
            this.checked = false;
        });
        this.handleChange();
        if (inside) {
            this.openmail(parseInt(email_id) + 1, curr_folder);
        }
        else {
            pagenum++;
            trindex = 0;
            $(table + ' tr:gt(0)').each(function () {
                trindex++;
                if (trindex > (maxrows * pagenum) || trindex <= ((maxrows * pagenum) - maxrows)) {
                    $(this).hide();
                }
                else {
                    $(this).show();
                }

            });
            this.updatehandlers();
        }
       
    }
    updatehandlers() {
        //totalrows = this.state.Inbox.length;
        if (pagenum == 1) {
            back = 1;
        }
        else {
            back = 0;
        }
        if (pagenum == Math.ceil(totalrows / maxrows) || Math.ceil(totalrows / maxrows) == 0) {
            forward = 1;
        }
        else {
            forward = 0;
        }
        this.setState({
            forward: forward,
            back: back
        })
    }

    emailhandle(par1, par2, par3, par4){
        this.updateSelected(par1, par2);
        this.openmail(par3, par4);
    }

    openmail(content, cat) {
        inside = 1;
        email_id = content;
        curr_folder = cat;
        if (cat == "Inbox") {
            content = this.state.Inbox.filter(function (el) {
                return el.id == content;
            });
        }
        else if (cat == "Important") {
            content = this.state.Important.filter(function (el) {
                return el.id == content;
            });
        }
        else if (cat == "Trash") {
            content = this.state.Trash.filter(function (el) {
                return el.id == content;
            });
        }
        this.setState({
            emailbody: content,
        }, () => {
            this.manageemails(email_id);
            this.handleChange();
        });
    }

    render() {
        const inb = this.state.selected == 0 && this.state.prev == -1 
            ? <div id="email" >
                <table border="0" id="mytable" >
                    <tr>
                        <td style={{ width: "5%" }}>

                        </td>

                        <td style={{ width: "20%" }}>
                            Email
                                </td>
                        <td style={{ width: "50%" }}>
                            Message
                                </td>
                        <td style={{ width: "25%" }}>
                            Date
                                </td>
                    </tr>
                    {this.state.Inbox.map((inbox_emails, index) => {
                        return (
                            <tr>
                                <td style={{ width: "5%" }}>
                                    <input type="checkbox" value={inbox_emails.id}
                                        onChange={() => this.handleChange()} />
                                </td>

                                <td style={{ width: "20%" }} onClick={() => this.emailhandle(4, selected,  inbox_emails.id, inbox_emails.category)}>
                                    {inbox_emails.emailAddress}
                                </td>
                                <td style={{ width: "50%" }} onClick={() => this.emailhandle(4, selected, inbox_emails.id, inbox_emails.category)} >
                                    {inbox_emails.message}
                                </td>
                                <td style={{ width: "25%" }} onClick={() => this.emailhandle(4, selected, inbox_emails.id, inbox_emails.category)} >
                                    {inbox_emails.date}
                                </td>
                            </tr>
                        )
                    })}
                </table>
            </div> : 
            null;

        const imp = this.state.selected == 1 && this.state.prev == -1
            ? <div id="email" >
                <table border="0" id="mytable1" >
                    <tr>
                        <td style={{ width: "5%" }}>

                        </td>

                        <td style={{ width: "20%" }}>
                            Email
                                </td>
                        <td style={{ width: "50%" }}>
                            Message
                                </td>
                        <td style={{ width: "25%" }}>
                            Date
                                </td>
                    </tr>
                    {this.state.Important.map((important_emails, index) => {
                        return (
                            <tr>
                                <td style={{ width: "5%" }}> 
                                    <input type="checkbox" value={important_emails.id}
                                        onChange={this.handleChange} />
                                </td>

                                <td style={{ width: "20%" }} onClick={() => this.emailhandle(4, selected, important_emails.id, important_emails.category)}>
                                    {important_emails.emailAddress}
                                </td>
                                <td style={{ width: "50%" }} onClick={() => this.emailhandle(4, selected, important_emails.id, important_emails.category)} >
                                    {important_emails.message}
                                </td>
                                <td style={{ width: "25%" }} onClick={() => this.emailhandle(4, selected, important_emails.id, important_emails.category)} >
                                    {important_emails.date}
                                </td>
                            </tr>
                        )
                    })}
                </table>
            </div> :
            null;

        const tra = this.state.selected == 2 && this.state.prev == -1
            ? <div id="email" >
                <table border="0" id="mytable2" >
                    <tr>
                        <td style={{ width: "5%" }}>

                        </td>

                        <td style={{ width: "20%" }}>
                            Email
                                </td>
                        <td style={{ width: "50%" }}>
                            Message
                                </td>
                        <td style={{ width: "25%" }}>
                            Date
                                </td>
                    </tr>
                    {this.state.Trash.map((trashed_emails, index) => {
                        return (
                            <tr>
                                <td style={{ width: "5%" }}>
                                    <input type="checkbox" value={trashed_emails.id}
                                        onChange={this.handleChange} />
                                </td>

                                <td style={{ width: "20%" }} onClick={() => this.emailhandle(4, selected, trashed_emails.id, trashed_emails.category)}>
                                    {trashed_emails.emailAddress}
                                </td>
                                <td style={{ width: "50%" }} onClick={() => this.emailhandle(4, selected, trashed_emails.id, trashed_emails.category)} >
                                    {trashed_emails.message}
                                </td>
                                <td style={{ width: "25%" }} onClick={() => this.emailhandle(4, selected, trashed_emails.id, trashed_emails.category)} >
                                    {trashed_emails.date}
                                </td>
                            </tr>
                        )
                    })}
                </table>
            </div> :
            null;


        const { classes } = this.props;
        const { selected } = this.state;
        const { prev } = this.state;
        const { emailbody } = this.state;

        return (
            <div className={classes.root}>
                <CssBaseline />
                <AppBar position="fixed" className={classes.appBar} style={{ backgroundColor: '#FF8800' }}>
                    <Toolbar>
                        <Typography variant="h4" color="inherit" noWrap>
                            FantaMail
          </Typography>
                        <div className={classes.grow} />
                        <div className={classes.search} >
                            <div className={classes.searchIcon}>
                                <SearchIcon />
                            </div>
                            <InputBase
                                placeholder="Search"
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.inputInput,
                                }}
                            />
                        </div>
                        <div className={classes.grow2} />
                        {numberNotChecked <= 0 && (selected === 0 || selected === 1) &&
                            <Tooltip title="Delete">
                                <IconButton color="inherit" aria-label="Delete" disabled='true'>
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        }
                        {numberNotChecked > 0 && (selected === 0 || selected === 1) &&
                            <Tooltip title="Delete">
                            <IconButton color="inherit" aria-label="Delete" onClick={() => this.Delete()}>
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>}
                         

                        
                        {numberNotChecked > 0 && (selected === 0 || selected === 2) &&
                            <Tooltip title="Move to Important">
                            <IconButton color="inherit" onClick={() => this.MovetoIMP()}>
                                <FlagIcon />
                                </IconButton>
                            </Tooltip> }
                        {numberNotChecked <= 0 && (selected === 0 || selected === 2) &&
                            <Tooltip title="Move to Important">
                                <IconButton color="inherit" disabled="true">
                                <FlagIcon />
                                </IconButton>
                            </Tooltip>
                        }

                        {numberNotChecked > 0 && (selected === 1 || selected === 2) &&
                            <Tooltip title="Move to Inbox">
                            <IconButton color="inherit" onClick={() => this.MovetoINB()}>
                                    <InboxIcon />
                                </IconButton>
                            </Tooltip>}
                        {numberNotChecked <= 0 && (selected === 1 || selected === 2) &&
                            <Tooltip title="Move to Inbox">
                                <IconButton color="inherit" disabled="true">
                                    <InboxIcon />
                                </IconButton>
                            </Tooltip>
                        }

                    </Toolbar>
                </AppBar>
                <Drawer
                    className={classes.drawer}
                    variant="permanent"
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <div className={classes.toolbar} />
                    <List>
                        <img style={{ padding: "15px 55px"}} src={logo} />
                        <ListItem button key="Inbox" onClick={() => this.updateSelected(0, -1)} selected={selected === 0} >
                            <ListItemIcon><MailIcon /></ListItemIcon>
                            <ListItemText primary="Inbox" />
                        </ListItem>
                        <ListItem button key="Important" onClick={() => this.updateSelected(1, -1)} selected={selected === 1}>
                            <ListItemIcon><BookmarkIcon /></ListItemIcon>
                            <ListItemText primary="Important" />
                        </ListItem>
                        <ListItem button key="Trash" onClick={() => this.updateSelected(2, -1)} selected={selected === 2}>
                            <ListItemIcon><DeleteIcon /></ListItemIcon>
                            <ListItemText primary="Trash" />
                        </ListItem>
                    </List>
                    <br /><br /><br /><br /><br /><br />
                    <Divider />
                </Drawer>
                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    {selected === 4 ? (
                        <Tooltip title="Back" >
                            <IconButton color="inherit" onClick={() => this.handleBack(-1,prev)}>
                                <ArrowLeftAltRounded />
                            </IconButton >
                        </Tooltip>) : (
                            <Tooltip title="Back">
                                <IconButton color="inherit" disabled="true">
                                    <ArrowLeftAltRounded />
                                </IconButton >
                            </Tooltip>)
                            }
                    {back > 0? (
                        <Tooltip title="Newer">
                            <IconButton color="inherit" style={{ position: 'absolute', right: 70 }} onClick={() => this.handlepagebackwards()} disabled="true">
                                <ArrowLeft />
                            </IconButton>
                        </Tooltip>) : (
                            <Tooltip title="Newer">
                                <IconButton color="inherit" style={{ position: 'absolute', right: 70 }} onClick={() => this.handlepagebackwards()}>
                                    <ArrowLeft />
                                </IconButton>
                            </Tooltip>
                            )}

                    {forward > 0? (
                        <Tooltip title="Older">
                            <IconButton color="inherit" style={{ position: 'absolute', right: 25 }} onClick={() => this.handlepageforward()} disabled="true">
                                <ArrowRight />
                            </IconButton>
                        </Tooltip>) : (
                            <Tooltip title="Older">
                                <IconButton color="inherit" style={{ position: 'absolute', right: 25 }} onClick={() => this.handlepageforward()}>
                                    <ArrowRight />
                                </IconButton>
                            </Tooltip>
                        )}
                   

                    <Divider />
                 
                    { inb }

                    { imp }

                    { tra }

                    {selected === 4 ? (<div id="email">

                        From: {emailbody[0].emailAddress}
                        <br/>
                        Date: {emailbody[0].date}
                        <br/><br/>
                        {emailbody[0].message}

                    </div>) : (null)}
                
                    <Typography paragraph>
                    </Typography>
                    <Typography paragraph>

                    </Typography>
                </main>
            </div>
        );
    }
}

ClippedDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ClippedDrawer);