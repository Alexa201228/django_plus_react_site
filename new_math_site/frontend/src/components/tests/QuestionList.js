import { Drawer, List, ListItem, Toolbar, Typography } from '@material-ui/core';
import React from 'react';
import { Link, useParams, withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
 import AppBar from '@material-ui/core/AppBar';
 import CssBaseline from '@material-ui/core/CssBaseline';
 import Divider from '@material-ui/core/Divider';
 import Hidden from '@material-ui/core/Hidden';
 import IconButton from '@material-ui/core/IconButton';

 import MenuIcon from '@material-ui/icons/Menu';
 import { makeStyles, useTheme } from '@material-ui/core';
 
 const drawerWidth = 150;
 const useStyles = makeStyles((theme) => ({
   root: {
     display: 'flex',
   },
   drawer: {
     [theme.breakpoints.up('sm')]: {
       width: drawerWidth,
       flexShrink: 0,
     },
   },
   appBar: {
     [theme.breakpoints.up('sm')]: {
       width: `calc(100% - ${drawerWidth}px)`,
       marginLeft: drawerWidth,
     },
     [theme.breakpoints.down('xs')]:{
      marginTop: theme.spacing(17)
     },
     marginTop: theme.spacing(8)
   },
   menuButton: {
     marginRight: theme.spacing(2),
     [theme.breakpoints.up('sm')]: {
       display: 'none',
     },
   },
   // necessary for content to be below app bar
   toolbar: theme.mixins.toolbar,
   drawerPaper: {
     width: drawerWidth,
     marginTop: theme.spacing(8),
     [theme.breakpoints.down('xs')]:{
      marginTop: theme.spacing(17)
     },
   },
   content: {
     flexGrow: 1,
     padding: theme.spacing(3),
     [theme.breakpoints.down('xs')]: {
       margin: theme.spacing(17, 0),
      padding: 0,
     },
   },
 }));
 
 export function QuestionList({questions}) {
   const classes = useStyles();
   const theme = useTheme();
   const [mobileOpen, setMobileOpen] = React.useState(false);
   
   const  {slug, lesson_slug, test_id } = useParams();
   const {finished, test} = useSelector(state => state.tests)
 
   const handleDrawerToggle = () => {
     setMobileOpen(!mobileOpen);
   };
 
   const drawer = (
     <div>
       <div className={classes.toolbar} />
       <Divider />
            <List>
                {questions.map((question, index) => (
                    <ListItem 
                        button 
                        component={Link}
                        to={`/${slug}/${lesson_slug}/${test_id}/${question.id}`}
                        key={`${question.id}+${test_id}`}>
                        <Typography>
                            Вопрос {index + 1}
                        </Typography>
                    </ListItem>
                    ))}
                    {finished &&  
                <ListItem
                    button 
                    component={Link}
                    to={`/${slug}/${lesson_slug}/${test_id}/results/test_results`}>
                        <Typography>
                            Результаты теста
                        </Typography>
                </ListItem>}    
            </List>
     </div>
   );
 
 
   return (
     <div className={classes.root}>
       <CssBaseline />
       <AppBar position="fixed" className={classes.appBar}>
         <Toolbar>
           <IconButton
             color="inherit"
             aria-label="open drawer"
             onClick={handleDrawerToggle}
             className={classes.menuButton}
           >
             <MenuIcon />
           </IconButton>
           <Typography variant="h6" noWrap>
             {test.title}
           </Typography>
         </Toolbar>
       </AppBar>
       <nav className={classes.drawer} aria-label="mailbox folders">
         {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
         <Hidden smUp implementation="css">
           <Drawer
             variant="temporary"
             anchor={theme.direction === 'rtl' ? 'right' : 'left'}
             open={mobileOpen}
             onClose={handleDrawerToggle}
             classes={{
               paper: classes.drawerPaper,
             }}
             ModalProps={{
               keepMounted: true, // Better open performance on mobile.
             }}
           >
             {drawer}
           </Drawer>
         </Hidden>
         <Hidden xsDown implementation="css">
           <Drawer
             classes={{
               paper: classes.drawerPaper,
             }}
             variant="permanent"
             open
           >
             {drawer}
           </Drawer>
         </Hidden>
       </nav>
       <main className={classes.content}>
         <div className={classes.toolbar} />

       </main>
     </div>
   );
 }
 

export default QuestionList;