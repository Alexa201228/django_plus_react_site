import React from 'react';
import { Link, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

import { Drawer, List, ListItem, Toolbar, Typography, Slide, makeStyles, useTheme } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';

import MenuIcon from '@material-ui/icons/Menu';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';

const drawerWidth = 175;
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
   toolbar: {
    alignItems: 'center',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(2)
   },
   drawerPaper: {
     width: drawerWidth,
     marginTop: theme.spacing(8),
     [theme.breakpoints.down('xs')]:{
      marginTop: theme.spacing(17)
     },
   },
   content: {
     flexGrow: 1,
     [theme.breakpoints.down('xs')]:{
      padding: 0,
     },
   },
 }));

  
function HideOnScroll(props) {
	const { children, window } = props;
	// Note that you normally won't need to set the window ref as useScrollTrigger
	// will default to window.
	// This is only being set here because the demo is in an iframe.
	const trigger = useScrollTrigger({ target: window ? window() : undefined });
  
	return (
	  <Slide appear={false} direction="down" in={!trigger}>
		{children}
	  </Slide>
	);
  }

  HideOnScroll.propTypes = {
	children: PropTypes.element.isRequired,
};
  

export function CourseLessonsList({lessons, course}, props){
    const { slug } = useParams();
    const classes = useStyles();
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
      };

    const checkCourseTest = () => {
        return typeof course.course_test[0] != "undefined"
    }

    const drawer = (
        <div>
          <div className={classes.toolbar}>
              <ListItem
                button
                component={Link}
                to={`/${slug}`}>
                    <Typography>
                        {course.title}
                    </Typography>    
              </ListItem>
          </div>
          <Divider />
               <List>
                   {lessons.map((lesson, index) => (
                       <ListItem 
                           button 
                           component={Link}
                           to={`/${slug}/${lesson.lesson_slug}`}
                           key={index}>
                               <Typography>
                           {lesson.lesson_name}
                              </Typography>
                       </ListItem>
                       ))}
                   {checkCourseTest() &&
                   <ListItem
                           button
                           component={Link}
                           to={`/${slug}/test/${course.course_test[0].id}`}>
                               <Typography>
                           {course.course_test[0].title}
                              </Typography>
                       </ListItem>}
               </List>
        </div>
      );
    return(
<div className={classes.root}>
        <CssBaseline />
        <HideOnScroll {...props}>
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
             {course.title}
           </Typography>
         </Toolbar>
          </AppBar>
          </HideOnScroll>
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
    )
}

export default CourseLessonsList;