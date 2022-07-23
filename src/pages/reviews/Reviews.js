import React from "react";
import axios from 'axios';
import CircleProgress from '../../components/CircleProgress/'
import Widget from "../../components/Widget";
import s from './Reviews.module.scss';
let banks, sources;

class Reviews extends React.Component {
	constructor(props) {
		super(props);
		this.state = {response: [], limit: 0};
		this.checkPosition = this.checkPosition.bind(this);
	}

	throttle(callee, timeout) {
		let timer = null
		return function perform(...args) {
			if (timer) return
			timer = setTimeout(() => {
				callee(...args)
				clearTimeout(timer)
				timer = null
			}, timeout)
		}
	}
	
	checkPosition() {
		// Высота документа и высота экрана:
		const height = Math.max(
				document.body.scrollHeight, document.documentElement.scrollHeight,
				document.body.offsetHeight, document.documentElement.offsetHeight,
				document.body.clientHeight, document.documentElement.clientHeight
		);
		const screenHeight = window.innerHeight
		// Cколько пикселей проскроллил
		const scrolled = window.scrollY
		// Порог
		const threshold = height - screenHeight / 4
		// Отслеживаем, где находится низ экрана относительно страницы:
		const position = scrolled + screenHeight
		// console.log(`Height - ${height}, screenHeight - ${screenHeight}, scrolled - ${scrolled}, threshold - ${threshold}, position - ${position}`)
		if (position >= threshold) {
			let headers = {
				'Access-Control-Allow-Origin' : '*'
			}
			axios.get(`https://reviews-ai.ru/api/v1/getreviews/?offset=${this.state.limit}&limit=${this.state.limit + 20}`, headers).then( res => {
				let result = this.state.response.concat(res.data.response)
				this.setState({ response: result, limit: this.state.limit + 20 });
			})
		}
	}

	showAll(event, body, item) {
		let pItem = document.getElementsByClassName(`item${item}`)[0];
		pItem.innerHTML = `<p>${body.review}</p>`;
	};

	componentDidMount() {
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
		let headers = {
			'Access-Control-Allow-Origin' : '*'
		}
		axios.get('https://reviews-ai.ru/api/v1/getreviews/?offset=100000&limit=100020', headers).then( res => {
			this.setState({ response: res.data.response, limit: 100020 });
		})
		window.addEventListener("scroll", this.throttle(this.checkPosition, 250))
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
		console.log(this.state.response)
		return (
			<div className={s.widgetClass}>
				<h1 className={s.pageTitle}>
					Отзывы
				</h1>
				{this.state.response.map((body, item) =>
				<Widget className={s.widgetElem}>
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
			</div>
		);
	}
}

export default Reviews;
