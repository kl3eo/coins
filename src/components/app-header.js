import React from 'react';
class AppHeader extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div className="app-header">
                <p>Binance</p>
                <p className='app-header--desc'>{this.props.description}</p>
            </div>
        )
    }
}

export default AppHeader;
