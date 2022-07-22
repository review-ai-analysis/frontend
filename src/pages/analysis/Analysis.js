import React from "react";
import { Row, Col, Button } from "reactstrap";

import Widget from "../../components/Widget";
import s from './Analysis.module.scss';
import CircleProgress from '../../components/CircleProgress/'
import SquareProgress from '../../components/SquareProgress/'


function setSquares(categories) {
	let labels = document.getElementsByClassName(`${s.label}`);
	for (let l = 0; l < labels.length; l++) {
		labels[l].innerHTML = `${categories[l][0]} <span class=${s.descriptionLabel}>${categories[l][1]}/10</span>`;
	}
	SquareProgress(`.${s.progressBar}`, categories, s.progressBar, s.progressBlock, s.active);
}

function setCircle(rating) {
	let el = document.getElementsByClassName(`${s.counter}`)[0];
	el.setAttribute('data-cp-percentage', rating);
	let standartText = document.getElementsByClassName(`${s.percentage}`);
	CircleProgress(`.${s.counter}`, standartText, s.percentage);
}

function setInfo() {
	let rating = document.getElementsByClassName('reviewArea')[0].value;
	if (!rating) { return; }

	// появление блока с результами анализа
	let widgets = document.getElementsByClassName(`${s.columnReviews}`);
	for (let i = 0; i < widgets.length; i++) {
		widgets[i].setAttribute('style', '');
	}

	let categoriesList = [['Дебетовые карты', rating], ['Ипотека', 5], ['Кредит', 3]]
	setSquares(categoriesList);
	setCircle(rating);
}

const Reviews = () => (
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
						<Button onClick={setInfo} color="default" style={{ marginTop: "0.5rem" }} 
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

export default Reviews;
