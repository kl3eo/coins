import React from "react";
import { connect } from 'react-redux'

import { changeLoadingStatus, marketPairDataUpdated  } from './redux/actions/app';

import { Logo, Tips } from "./utils";

import Select from "react-select";
import "react-select/dist/react-select.css";

import ReactTable from "react-table";
import "react-table/react-table.css";
import axios from 'axios';
import BSocket from './util/socket';

import PropTypes from 'prop-types';
import './App.css'

let bookTickerWS;

const options = [
  { label: "BTCUSDT", value: 1 },
  { label: "XRPUSDT", value: 2 },
  { label: "BTSUSDT", value: 3 }
];

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
      filtered: [],
      select1: 1,
      wsSwitch: -1
    };
  }


  async getData(sel) {


	let currapi = sel === 1 ? 'BTCUSDT' : sel === 2 ? 'XRPUSDT' : 'BTSUSDT';

	axios.get('/api/v3/depth?symbol=' + currapi + '&limit=10', {responseType: 'json'})
            .then(response => {
//console.log("data",response.data)	    	    
                this.setState({ data: response.data});
            })
            .catch(function (error){
                console.log(error);
            })
  }
  
  componentDidMount() {
	this.getData(this.state.select1);

	let currwss = this.state.select1 === 1 ? 'btcusdt' : this.state.select1 === 2 ? 'xrpusdt' : 'btsusdt'; 
	
	bookTickerWS = new BSocket(currwss + '@bookTicker', (event) => {
//console.log("wss data",event.data.data);
	let marketPair = JSON.parse(event.data).data;
//console.log("marketPair",marketPair);
	let marketPairListA = [{0:marketPair.a,1:marketPair.A}];
	let marketPairListB = [{0:marketPair.b,1:marketPair.B}];  
	this.props.marketPairDataUpdated(marketPairListA,marketPairListB);
        });


  }

  componentWillUnmount() {
        bookTickerWS.close();
  }

  componentDidUpdate(prevProps, prevState) {
	if (prevState.select1 !== this.state.select1) {
//console.log('select1 state has changed.', this.state.select1)
    
		this.getData(this.state.select1)
		bookTickerWS.close();
    
		let currwss = this.state.select1 === 1 ? 'btcusdt' : this.state.select1 === 2 ? 'xrpusdt' : 'btsusdt'; 

		bookTickerWS = new BSocket(currwss + '@bookTicker', (event) => {
			let marketPair = JSON.parse(event.data).data;
			let marketPairListA = [{0:marketPair.a,1:marketPair.A}];
			let marketPairListB = [{0:marketPair.b,1:marketPair.B}];  
			this.props.marketPairDataUpdated(marketPairListA,marketPairListB);
        	});    
	}
  }

  handleWebSocketSwitchChange(checked) {
        this.setState({ wsSwitch: -1 })
        if (checked && this.state.wsSwitch === -1) {
            bookTickerWS.open().then(() => {
                this.setState({ wsSwitch: 1 })
            });

        }
        else {
            bookTickerWS.close().then(() => {
                this.setState({ wsSwitch: -1 })
            })
        }
  }


  render() {
    const { data } = this.state;
//console.log("here data",data);	  
    return (
      <div>
        <br />
        <br />
	<br />
	<div style={{float:'left'}}>
		<Select options={options} onChange={entry => {this.setState({ select1: entry.value });this.forceUpdate();}} style={{width: "160px", margin: "0px 10px 20px 3px"}} value={this.state.select1}/>
	</div><div style={{float:'left', marginRight:'10px'}}>
	
	</div>
	 
	 
	 <div style={{ marginTop: "5px"}} >
	 	WSS Start/Stop&nbsp;&nbsp;<input type='checkbox' onChange={this.handleWebSocketSwitchChange.bind(this)} checked={this.state.wsSwitch === -1}  />
         </div>
	 <div style={{clear:'left'}}></div>
       

	 <div style={{clear:'left'}}></div>
	 
	 <div style={{width:'100%'}}>
	 <div style={{width:'48%', float:'left'}}>
        <ReactTable
          data={this.state.wsSwitch === 1 ?  this.props.marketPairListA : data.asks}
          columns={[
      {
        Header: 'Binance API depth: ASKS ' + (this.state.select1 === 1 ? 'BTCUSDT' : this.state.select1 === 2 ? 'XRPUSDT' : 'BTSUSDT'),
        columns: [
  
          {
            Header: 'Price',
	    accessor: '0',
          },
	  {
            Header: 'Qty',
            accessor: '1',
          }
        ],
      },
          ]}
          defaultPageSize={10}
          className="-striped -highlight"
        />
	</div>
	 <div style={{width:'48%', float:'right'}}>
        <ReactTable
          data={this.state.wsSwitch === 1 ?   this.props.marketPairListB : data.bids}
          columns={[
      {
        Header: 'Binance API depth: BIDS ' + (this.state.select1 === 1 ? 'BTCUSDT' : this.state.select1 === 2 ? 'XRPUSDT' : 'BTSUSDT'),
        columns: [
  
          {
            Header: 'Price',
	    accessor: '0',
          },
	  {
            Header: 'Qty',
            accessor: '1',
          }
        ],
      },
          ]}
          defaultPageSize={10}
          className="-striped -highlight"
        />
	</div>
	<div style={{clear:'both'}}></div>
	</div>
	
        <br />
        <Tips />
        <Logo />
      </div>
    );
  }
}

App.propTypes = {
    loadingStatus: PropTypes.bool,
    marketPairListA: PropTypes.array,
    marketPairListB: PropTypes.array,
    loading: PropTypes.func,
    marketPairDataUpdated: PropTypes.func
}

const mapStateToProps = (state) => {
    return {
        loadingStatus: state.app.loading,
        marketPairListA: state.app.marketPairListA,
	marketPairListB: state.app.marketPairListB
    }
}

const mapDispatchToProps = {
    loading: (status) => changeLoadingStatus(status),
    marketPairDataUpdated
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

