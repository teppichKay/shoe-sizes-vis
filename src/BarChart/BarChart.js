import React, { Component } from 'react';
import {Bar} from 'react-chartjs-2';
import axios from 'axios';
import './BarChart.css';

const allWidth = ['3A', '2A', 'A', 'B', 'C',
				'D', 'E', '2E', '3E'];

const colorArr = ['rgba(255, 99, 132, 0.4)',
        'rgba(54, 162, 235, 0.4)',
        'rgba(255, 206, 86, 0.4)',
        'rgba(75, 192, 192, 0.4)',
        'rgba(153, 102, 255, 0.4)',
				'rgba(255, 99, 132, 0.4)',
        'rgba(54, 162, 235, 0.4)',
        'rgba(255, 206, 86, 0.4)',
        'rgba(75, 192, 192, 0.4)'];

class BarChart extends Component {
	state = {
		
		testData : {
			labels: null,
			datasets: null
		},
		gender: null,
		system: null,
		nextPageToken: "",
	}


	componentWillMount () {
		console.log('hi');
		this.fetchChartData(this.props.onShow, "");
	}

	componentWillReceiveProps (nextProps) {
		console.log('next props.', nextProps);
		const newUserName = nextProps.onShow;
		this.setState({nextPageToken: ""});
		this.fetchChartData(newUserName, "");
	}

	fetchChartData = (userName, params) => {
		// console.log('fetchChartData');
		var auth = "";
		if (userName === 'admin') {
			auth = "admin:ToPsEcReT"
		} else if (userName === 'manager') {
			auth = "manager:12345"
		} else if (userName === 'store') {
			auth = 'store:november17'
		};

		var query = params === "" ? "" : "?page=" + params;
		

		axios.get('https://homeexercise.volumental.com​/sizingsample'+query,
		{
			headers: {
				"Authorization" : "Basic " + btoa(auth)
			}
		})
		.then(response => {

			// console.log(response);
			const sizes = response.data.data[0].sizes;
			const system = response.data.data[0].system;
			const gender = response.data.data[0].gender;
			this.setState({system: system, gender: gender});
			
			// check if there is 'next page'
			if (response.data['next-page']) {
				this.setState({nextPageToken: response.data['next-page']})
			} 
			// length: 7,8,9,10 .... 
			const len = Object.keys(sizes);
			len.sort((a,b) => { return a-b; });
			this.setState({testData: {...this.state.testData, labels: len }});


			var allData = [];
			for (var i = 0; i < allWidth.length; i++) {
				var widthGroup = {};
				var dataForLength=[];
				for(var j = 0; j < len.length; j++) {
					var index = len[j];
					var lengthWithWidth = {};
					lengthWithWidth[index] = sizes[index][allWidth[i]] === undefined ? 0 : sizes[index][allWidth[i]];
					dataForLength.push(lengthWithWidth[index]);
				}

				widthGroup.label = allWidth[i];
				widthGroup.data = dataForLength;
				widthGroup.stack = 'Stack 0';
				widthGroup.backgroundColor = colorArr[i];
				allData.push(widthGroup);
			
			}

			return allData;
		})
		.then(data => {
			this.setState({testData: {...this.state.testData, datasets: data }})
		})
		.catch(err => {
			console.log(err);
			if (err.response) {
				console.log(err.response);
			}
		})
		
	}

	render () {
		//console.log(this.props.onShow);
		// console.log(this.state.testData);
		// console.log(this.state.nextPageToken);
		return (
			<div className='chart'>
				<Bar 
					data={this.state.testData}
				/>
				<div className="info-panel">
					<div className="info-title">Information: </div>
					<div className='info-content'>{this.state.gender}</div>
					<div className='info-content'>{this.state.system}</div>
				</div>
				<div className="next-page-btn-container">
					<button className="next-page-btn" onClick={() => this.fetchChartData(this.props.onShow, this.state.nextPageToken)}>Next Page</button>
				</div>
			</div>
		)
	}
}

export default BarChart;