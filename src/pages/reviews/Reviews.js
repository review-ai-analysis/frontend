import React from "react";
import axios from 'axios';
import CircleProgress from '../../components/CircleProgress/'
import Widget from "../../components/Widget";
import s from './Reviews.module.scss';
let banks, sources;

class Reviews extends React.Component {
	constructor(props) {
		super(props);
		this.state = {response: []};
	}

	showAll(event, body, item) {
		let pItem = document.getElementsByClassName(`item${item}`)[0];
		pItem.innerHTML = `<p>${body.review}</p>`;
	};

	componentDidMount() {
		let headers = {
			'Access-Control-Allow-Origin' : '*'
		}
		axios.get('https://reviews-ai.ru/api/v1/getreviews/?offset=0&limit=20', headers).then( res => {
      		this.setState({ response: res.data.response });
    	})
	}

	componentDidUpdate() {
		banks = [
		['gpb', 'Газпромбанк'],
		['alfa', 'Альфа-Банк'],
		['pochtabank', 'Почта Банк'],
		['raif', 'Райффайзенбанк'],
		['sberbank', 'СберБанк'],
		['tinkoff', 'Тинькофф'],
		['vtb', 'ВТБ']
		];
		sources = [
		['otzovik', 'Отзовик'],
		['i_recomend', 'IRecommend.ru'],
		['playmarket', 'Google PlayMarket'],
		['banki_ru', 'Banki.ru']
		];
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
							<h4>{body.username} 
								{body.url && <a href={body.url}> (источник)</a>}
								<span className={s.date}>{body.publication_date.split('T')[0].split('-').reverse().join('.')}</span></h4>
							{body.review.length < 450 
								? <p>{body.review}</p>
								: <p className={`item${item}`}>{body.review.slice(0, 450)}...<br></br><a className={s.showFullReview} onClick={(e) => {this.showAll(e, body, item); }}> Показать полностью</a></p>
							}
						</div>
						<div className={s.data}>
							{body.rating != -1 &&
							<div className={s.rating}>
								<h5 className={s.descriptionAnalysis}>Оценка отзыва</h5>
								<div className={s.counter} data-cp-percentage={body.rating * 5}></div>
							</div>
							}
							<div className={s.categories}>
								<h5 className={s.descriptionAnalysis}>Другие характеристики</h5>
								<div className={s.categoriesElem}>Адрес: {body.address}</div>
								{banks.map((bank, index) =>
									banks[index][0].includes(body.bank) && <div className={s.categoriesElem}>Банк: {banks[index][1]}</div>
								)}
								{body.category_name
									? <div className={s.categoriesElem}>Категория: {body.category_name}</div>
									: <div className={s.categoriesElem}>Категория: не указана</div>
								}
								{sources.map((source, index) =>
									sources[index][0].includes(body.source) && <div className={s.categoriesElem}>Ресурс: {sources[index][1]}</div>
								)}
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
