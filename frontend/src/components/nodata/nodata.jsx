import React, { Component } from 'react';
import images from '../../images';
import { Card, CardBody, CardTitle } from 'reactstrap';
import './nodata.css';

class nodata extends Component {
    render() {
        return (
            <Card className="nodata text-center">
                <CardBody>
                    <CardTitle>
                        No Data Available
                    </CardTitle>
                    <img src={images.nodata} alt="no data"/>
                </CardBody>
            </Card>
        );
    }
}


export default nodata;