import React from "react";
import axios from 'axios';
import s from './Charts.module.scss';
import {Line} from 'react-chartjs-2';
import {CategoryScale} from 'chart.js';
import Chart from 'chart.js/auto';

let banks, sources;
Chart.register(CategoryScale);
Chart.defaults.color = "#fff";

class Charts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            response: [], labels: [], banks: {
                'gpb': 'Газпромбанк',
                'alfa': 'Альфа-Банк',
                'pochtabank': 'Почта Банк',
                'raif': 'Райффайзенбанк',
                'sberbank': 'СберБанк',
                'tinkoff': 'Тинькофф',
                'vtb': 'ВТБ'
            }
        }
    }

    getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    componentDidMount() {
        axios.get("https://reviews-ai.ru/api/v1/getstats").then(r => {
            this.setState({response: r.data})
        });
        this.state.response.forEach(element => {
            console.log(Object.keys(element))
        })
    }

    render() {
        if (this.state.response.length == 0) {
            return (
                <div></div>
            )
        }
        const data = {
            datasets: []
        };
        data["labels"] = this.state.labels;
        var bank = {}
        let numbers = [];
        for (var key in this.state.response) {
            var elements = this.state.response[key]
            elements.forEach(date => {
                    if (this.state.labels.length == 115) {
                        return;
                    }
                    var date_T = date["publication_date_"].split("T")[0]
                    this.state.labels.push(date_T);
                }
            )
            numbers = [];
            elements.forEach(element => {
                numbers.push(element["count"])
            })

            var color = this.getRandomColor()
            data["datasets"].push({
                label: this.state.banks[key],
                fill: false,
                lineTension: 0.1,
                borderCapStyle: 'butt',
                borderDash: [],
                backgroundColor: color,
                borderColor: color,
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                scaleLabel: {fontSize: 10},
                data: numbers
            })
        }
        return (
            <div className={s.widgetClass}>
                <h1 className={s.pageTitle}>
                    График
                </h1>
                <Line id="chart_graph" height='100%' data={data} className={s.animCharts}/>
            </div>
        );
    }
}

export default Charts;
