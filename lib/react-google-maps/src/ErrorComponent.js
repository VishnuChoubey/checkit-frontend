/* eslint-disable react/prefer-stateless-function */
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';

export default class GoogleMap extends React.Component {
    render() {
        const {
            errorMarker,
            markers
        } = this.props;
        return ( <
            div style = {
                {
                    overflow: 'scroll'
                }
            } > {
                `id is mandatory for marker: ${JSON.stringify(errorMarker)}.`
            } <
            br / >
            <
            br / > {
                `All markers are: ${JSON.stringify(markers)}`
            } <
            /div>
        );
    }
}