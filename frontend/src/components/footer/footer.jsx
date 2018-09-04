import React, { Component } from 'react';

import {
	Container
} from 'reactstrap';
class footer extends Component {
    render() {
        return (
            <footer className={'footer text-center'}>
               <Container>
                Boeing &copy; 2018
               </Container>
            </footer>
        );
    }
}



export default footer;