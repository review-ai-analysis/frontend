import React from "react";
import axios from 'axios';
import { Row, Col, Button } from "reactstrap";
import CircleProgress from '../../components/CircleProgress/'
import Widget from "../../components/Widget";
import s from './Reviews.module.scss';

class Reviews extends React.Component {
	constructor(props) {
		super(props);
		this.state = {response: []};
	}

	componentDidMount() {
		let headers = {
			'Access-Control-Allow-Origin' : '*'
		}
		axios.get('https://reviews-ai.ru/api/v1/getreviews/?offset=0&limit=20', headers).then( res => {
      		this.setState({ response: res.data.response });
    	})
	}

	componentDidUpdate() {
		let standartText, classPercentage;
		try {
			standartText = document.getElementsByClassName(`${s.percentage}`);
			classPercentage = s.percentage;
		} catch {
			return;
		}
		CircleProgress(`.${s.counter}`, standartText, classPercentage);
	}

	render() {
		if (Object.keys(this.state.response).length == 0) {
			return (<div>
				<h1 className="page-title">
					Отзывы
				</h1>
			</div>);
		}
		console.log(this.state.response.map((body, item) => body))
		return (
			<div>
				<h1 className="page-title">
					Отзывы
				</h1>
				{this.state.response.map((body, item) =>
				<Widget>
					<div className={s.review}>
						<div className={s.text}>
							<h4>{body.username} <span className={s.date}>{body.publication_date.split('T')[0].split('-').reverse().join('.')}</span></h4>
							<p>{body.review}</p>
						</div>
						<div className={s.data}>
							<div className={s.rating}>
								<p className={s.descriptionAnalysis}>Общая оценка</p>
								<div className={s.counter} data-cp-percentage={body.rating * 5}></div>
							</div>
							<div className={s.categories}>
								<div className={s.bank}>Bank</div>
							</div>
						</div>
					</div>
				</Widget>
				)}
				<Widget>
					<div className={s.review}>
						<div className={s.text}>
							<h4>Название отзыва <span className={s.date}>19.07.2022</span></h4>
							<p>Текст отзыва... Обычный текст для тестирования и отладки переноса строки, а также правильности
							работы скрипта и много чего другого...</p>
						</div>
						<div className={s.data}>
							<div className={s.rating}>
								<p className={s.descriptionAnalysis}>Общая оценка</p>
								<div className={s.counter} data-cp-percentage="0" data-cp-color="#00bfeb"> </div>
							</div>
							<div className={s.categories}>
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
								<div className={s.bank}>Bank</div>
							</div>
						</div>
					</div>
				</Widget>
				<button onClick={this.showState}>Тестовая кнопка</button>
			</div>
		);
	}
}

export default Reviews;
