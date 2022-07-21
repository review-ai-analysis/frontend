import React from "react";
import axios from 'axios';
import { Row, Col, Button } from "reactstrap";
import CircleProgress from '../../components/CircleProgress/'
import SquareProgress from '../../components/SquareProgress/'
import Widget from "../../components/Widget";
import s from './Reviews.module.scss';

function setInfo() {
	let standartText = document.getElementsByClassName(`${s.percentage}`);
	let classPercentage = s.percentage;
	CircleProgress(`.${s.counter}`, standartText, classPercentage);
	console.log('onload');
};

let state;
class Reviews extends React.Component {
	showState() {
		console.log(state);
	}
	componentDidMount() {
		let headers = {
			'Access-Control-Allow-Origin' : '*'
		}
		axios.get('https://reviews-ai.ru/api/v1/getreviews/?offset=0&limit=50', headers).then( res => {
      		state = ({ response: res.data.response });
    	})
    	setTimeout(() => {
    		
    	}, 500);
	}
	render() {

		this.showState()
		return (
			<div>
				<h1 className="page-title">
					Отзывы
				</h1>
				{state.map((body, index) => {
					body.rating
				})}
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
