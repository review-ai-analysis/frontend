import React from "react";
import { Row, Col, Button } from "reactstrap";
import axios from 'axios';

import Widget from "../../components/Widget";
import s from './Analysis.module.scss';
import CircleProgress from '../../components/CircleProgress/'
import SquareProgress from '../../components/SquareProgress/'

class Analysis extends React.Component {
	constructor(props) {
		super(props);
		this.state = {categories: [], rating: 0, error: ''};
		this.setInfo = this.setInfo.bind(this);
	}

	setSquares(categories) {
		let labels = document.getElementsByClassName(`${s.label}`);
		for (let l = 0; l < labels.length; l++) {
			categories[l][1] = categories[l][1] * 10;
			labels[l].innerHTML = `${categories[l][0]} <span class=${s.descriptionLabel}>${categories[l][1].toFixed(1)}/10</span>`;
		}
		SquareProgress(`.${s.progressBar}`, categories, s.progressBar, s.progressBlock, s.active);
	}

	setCircle(rating) {
		let el = document.getElementsByClassName(`${s.counter}`)[0];
		el.setAttribute('data-cp-percentage', rating);
		let standartText = document.getElementsByClassName(`${s.percentage}`);
		CircleProgress(`.${s.counter}`, standartText, s.percentage);
	}

	setInfo() {
		let categories, rating;
		let headers = {
			'Access-Control-Allow-Origin' : '*'
		}
		let textAreaValue = document.getElementsByClassName('reviewArea')[0].value;
		if (!textAreaValue) { return; }
		let bodyFormData = new FormData();
		bodyFormData.append('review', textAreaValue)

		axios({
	    	method: 'post',
	    	url: 'https://reviews-ai.ru/api/v1/',
	    	data: bodyFormData,
	  		headers: { "Content-Type": "multipart/form-data" },
		}).then(res => {
			console.log(res.data)
			if(res.data.response) {
				this.setState({ categories: res.data.response.categories, rating: res.data.response.rating * 5 });	
				let errorDiv = document.getElementById('errorDiv');
				errorDiv.setAttribute('style', 'display: none')
				let widgets = document.getElementsByClassName(`${s.columnReviews}`);
				for (let i = 0; i < widgets.length; i++) {
					widgets[i].setAttribute('style', '');
				}
				this.setSquares(this.state.categories);
				this.setCircle(this.state.rating);
			} else {
				this.setState({ error: res.data.error })
				let widgets = document.getElementsByClassName(`${s.columnReviews}`)[1];
				widgets.setAttribute('style', 'display: none');
				let errorDiv = document.getElementById('errorDiv');
				errorDiv.setAttribute('style', '')
				errorDiv.textContent = this.state.error;
			}
		})
	}

	render() {
		return (
			<div>
				<h1 className="page-title">
					Анализ отзыва
				</h1>
				<Row>
					<Col xs={12} lg={6}>
						<Widget className={s.columnReviews}>
							<h4>Для получения анализа введите ваш отзыв в поле ниже</h4>
							<form>
								<div className="mb-3 w-100 h-100 border rounded">
									<textarea type="text" rows="5" style={{ background: "transparent" }} 
											className="form-control reviewArea" 
											placeholder="Введите текст вашего отзыва здесь..."></textarea>
								</div>
								<div className="alert alert-danger" role="alert" id="errorDiv" style={{ display: 'none' }}>Просто проверка поля текста для ошибок</div>
								<Button onClick={this.setInfo} color="default" style={{ marginTop: "0.5rem" }} 
										className="mr-2" size="sm">Отправить</Button>
							</form>
						</Widget>
					</Col>
					<Col xs={12} lg={6}>
						<Widget className={s.columnReviews} style={{display: 'none'}}>
							<h4>Рейтинг отзыва</h4>
							<div className={s.bgStyle}>
								<div className={s.rating}>
									<p className={s.descriptionAnalysis}>Общая оценка</p>
									<div className={s.counter} data-cp-percentage="0" data-cp-color="#00bfeb"> </div>
								</div>
								<div className={s.categories}>
									<p className={s.descriptionAnalysis}>По категориям</p>
									<div className={s.label}>Отсутствует <span className={s.descriptionLabel}>0/10</span></div>
									<div className={s.progressBar}>
										<div className={s.progressBlock}></div>
										<div className={s.progressBlock}></div>
										<div className={s.progressBlock}></div>
										<div className={s.progressBlock}></div>
										<div className={s.progressBlock}></div>
										<div className={s.progressBlock}></div>
										<div className={s.progressBlock}></div>
										<div className={s.progressBlock}></div>
										<div className={s.progressBlock}></div>
										<div className={s.progressBlock}></div>
									</div>
									<div className={s.label}>Отсутствует <span className={s.descriptionLabel}>0/10</span></div>
									<div className={s.progressBar}>
										<div className={s.progressBlock}></div>
										<div className={s.progressBlock}></div>
										<div className={s.progressBlock}></div>
										<div className={s.progressBlock}></div>
										<div className={s.progressBlock}></div>
										<div className={s.progressBlock}></div>
										<div className={s.progressBlock}></div>
										<div className={s.progressBlock}></div>
										<div className={s.progressBlock}></div>
										<div className={s.progressBlock}></div>
									</div>
									<div className={s.label}>Отсутствует <span className={s.descriptionLabel}>0/10</span></div>
									<div className={s.progressBar}>
										<div className={s.progressBlock}></div>
										<div className={s.progressBlock}></div>
										<div className={s.progressBlock}></div>
										<div className={s.progressBlock}></div>
										<div className={s.progressBlock}></div>
										<div className={s.progressBlock}></div>
										<div className={s.progressBlock}></div>
										<div className={s.progressBlock}></div>
										<div className={s.progressBlock}></div>
										<div className={s.progressBlock}></div>
									</div>
								</div>
							</div>
						</Widget>
					</Col>
				</Row>
			</div>
		);
	}
};

export default Analysis;
