import React from "react";
import axios from 'axios';
import CircleProgress from '../../components/CircleProgress/'
import Widget from "../../components/Widget";
import s from './Reviews.module.scss';
import {Dropdown} from "@nextui-org/react";
import {Button, Grid} from "@nextui-org/react";

let banks, sources;
let headers = {'Access-Control-Allow-Origin': '*'}

class Reviews extends React.Component {

    constructor(props) {
        super(props);
        this.state = {response: [], limit: 0, categories: [], filters: []};
        this.checkPosition = this.checkPosition.bind(this);
        this.categories_dropdown = this.categories_dropdown.bind(this);
        this.delete_filter = this.delete_filter.bind(this);
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
                'Access-Control-Allow-Origin': '*'
            }
            axios.get(`https://reviews-ai.ru/api/v1/getreviews/?offset=${this.state.limit}&limit=${this.state.limit + 20}`, headers).then(res => {
                let result = this.state.response.concat(res.data.response)
                this.setState({response: result, limit: this.state.limit + 20});
            })
        }
    }

    showAll(event, body, item) {
        let pItem = document.getElementsByClassName(`item${item}`)[0];
        pItem.innerHTML = `<p>${body.review}</p>`;
    };

    componentDidMount() {
        banks = {
            'gpb': 'Газпромбанк',
            'alfa': 'Альфа-Банк',
            'pochtabank': 'Почта Банк',
            'raif': 'Райффайзенбанк',
            'sberbank': 'СберБанк',
            'tinkoff': 'Тинькофф',
            'vtb': 'ВТБ'
        };
        sources = {
            'otzovik': 'Отзовик',
            'i_recomend': 'IRecommend.ru',
            'playmarket': 'Google PlayMarket',
            'banki_ru': 'Banki.ru'
        };
        axios({
            method: "get",
            url: "https://reviews-ai.ru/api/v1/getreviews/?offset=0&limit=50",
            headers: headers,
        }).then(res => {
            this.setState({response: res.data.response, limit: 50});
        })
        axios({
            method: "get",
            url: "http://195.140.146.94:8640/api/v1/getcategories/",
            headers: headers
        }).then(res => {
            res["data"]["response"].forEach((value, index) => {

                if (value === null) {
                    this.state.categories.push({name: "Без категории", key: value})
                    return;
                }
                this.state.categories.push({name: value, key: value})
            })
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

    categories_dropdown(element) {
        let functionExit = false;
        let array = this.state.filters
        array.forEach((value, index) => {
            if (element === Object.keys(value)[0]) {
                functionExit = true;
                return
            }

            if (element  === "Без категории") {
                functionExit = true;
                return
            }
        });
        if (functionExit === true) {
            return;
        }
        array.push({[element]: ["category_name"]})
        this.setState({filters: array})
        window.scrollTo(0, 0)
    }

    delete_filter(element) {
        this.state.filters.forEach((value, index) => {
            if (element["target"].children[0].textContent === Object.keys(value)[0]) {
                this.state.filters.splice(index, 1);
                this.setState({filters: this.state.filters});
                return;
            }

            if (element["target"].children[0].textContent === "Без категории") {
                this.state.filters.splice(index, 1);
                this.setState({filters: this.state.filters});
                return;
            }
        });

    }

    render() {
        if (Object.keys(this.state.response).length === 0) {
            return (<div>
                <h1 className="page-title">
                    Отзывы
                </h1>
            </div>);
        }

        return (
            <div className={s.widgetClass}>
                <h1 className={s.pageTitle}>Отзывы</h1>
                <Dropdown>
                    <Dropdown.Button css={{marginBottom: "12px", backgroundColor: "#11132d"}} flat
                                     color="default">Категории</Dropdown.Button>
                    <Dropdown.Menu aria-label="Dynamic Actions" items={this.state.categories}
                                   onAction={this.categories_dropdown}>
                        {(item) => (
                            <Dropdown.Item key={item.key} color="default">{item.name}</Dropdown.Item>
                        )}
                    </Dropdown.Menu>
                </Dropdown>
                <Grid.Container gap={2}>
                    {this.state.filters.map((body, item) =>
                        <Grid key={item}>
                            <Button auto
                                    onPress={this.delete_filter}>{Object.keys(body)[0] === "null" ? "Без категории" : Object.keys(body)[0]}</Button>
                        </Grid>
                    )}
                </Grid.Container>
                {this.state.response.map((body, item) =>
                    <Widget key={item} className={s.widgetElem}>
                        <div className={s.review}>
                            <div className={s.text}>
                                <h4>{body.username}
                                    {body.url && <a href={body.url}> (источник)</a>}
                                    <span
                                        className={s.date}>{body.publication_date.split('T')[0].split('-').reverse().join('.')}</span>
                                </h4>
                                {body.review.length < 450
                                    ? <p>{body.review}</p>
                                    : <p className={`item${item}`}>{body.review.slice(0, 450)}...<br></br><a
                                        className={s.showFullReview} onClick={(e) => {
                                        this.showAll(e, body, item);
                                    }}> Показать полностью</a></p>
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
                                    <div className={s.categoriesElem}>Банк: {banks[body.bank]}</div>
                                    {body.category_name
                                        ? <div className={s.categoriesElem}>Категория: {body.category_name}</div>
                                        : <div className={s.categoriesElem}>Категория: не указана</div>
                                    }
                                    <div className={s.categoriesElem}>Ресурс: {sources[body.source]}</div>
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
