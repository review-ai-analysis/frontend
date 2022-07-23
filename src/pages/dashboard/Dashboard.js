import React from "react";
import { Row, Col, Progress, Table, Label, Input } from "reactstrap";

import Widget from "../../components/Widget";

import AnimateNumber from "react-animated-number";
import s from "./Dashboard.module.scss";

import first from './first.png';
import second from './second.png';
import third from './third.png';
import forth from './forth.png';

class Dashboard extends React.Component {
	render() {
		return (
			<div className={s.main}>
				<div className={s.flexElem}>
					<img src={first}></img>
				</div>
				<div className={s.flexElem}>
					<h2>Проблема и актуальность</h2>
					<p>В наше время существует большое количество фирм-конкурентов практически во всех отраслях бизнеса. Чтобы быть успешным, руководителям необходимо слышать своих клиентов и ставить задачи в соответствии с их нуждами. Сейчас обратная связь собирается в основном на сайтах и специализированных форумах.
						Большое количество информации, содержащееся в этом массиве данных, возможно обработать только с помощью машинного обучения.
						Важной задачей является создание модели машинного обучения, которая была бы способна анализировать и категоризировать данные отзывов с различных источников.</p>
				</div>
				<div className={s.flexElem}>
					<img src={second}></img>
				</div>
				<div className={s.flexElem}>
					<h2>Гипотезы</h2>
					<p>Наша система автоматизированного анализа отзывов поможет находить в короткие сроки и исправлять проблемные места в бизнес-компаниях. Агрегированная информация на сайте предоставляет ёмкую выдержку ключевых аспектов, волнующих пользователей.</p>
				</div>
				<div className={s.flexElem}>
					<img src={third}></img>
				</div>
				<div className={s.flexElem}>
					<h2>Цель</h2>
					<p>Нашей конечной целью является создание и тренировка модели машинного обучения для анализа и категоризации отзывов о бизнес-компаниях.</p>
				</div>
				<div className={s.flexElem}>
					<img src={forth}></img>
				</div>
				<div className={s.flexElem}>
					<h2>Решение и результаты</h2>
					<p>Для достижения нашей цели мы собрали массив данных, провели их предобработку и анализ, создали и обучили несколько моделей машинного обучения. Чтобы представление результатов было удобно для пользователя, мы разработали веб-сервис с интуитивно понятным интерфейсом.</p>
				</div>
			</div>
		);
	}
}

export default Dashboard;
