
import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import ImageRenderer from '@nikuz/images-renderer';

import Ico from 'components/Ico';

import styles from './styles.scss';

const SLIDER_WIDTH = 600;

export default class Slider extends React.Component {
    state = {
        currentSlide: 0,
    };

    currentSlideEl;

    currentSlide;

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyboardPress);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.items !== this.props.items) {
            this.setState({
                currentSlide: 0,
            });
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.currentSlide && nextState.currentSlide !== this.state.currentSlide) {
            this.currentSlide.stop();
            this.currentSlideEl.innerText = '';
        }
    }

    componentDidUpdate() {
        const { items } = this.props;
        const { currentSlide } = this.state;

        if (!items.length) {
            return;
        }

        this.currentSlide = new ImageRenderer({
            container: this.currentSlideEl,
            width: 600,
            height: 600,
            imageURL: items[currentSlide].image,
            // text
            text: items[currentSlide].text,
            textFontFamily: 'Kaushan Script',
            textEffect: 'slide lines', // type | fade lines | fade letters | slide lines | append lines | fade
            textAlign: 'right', // left | center | right
            textVerticalAlign: 'top', // top | center | bottom
            // author
            author: items[currentSlide].author,
            authorFontFamily: 'Nickainley',
            authorEffect: 'fade', // type | slide | append | fade
            authorAlign: 'left', // left | center | right
            authorVerticalAlign: 'bottom', // top | center | bottom
            // common
            animate: true,
            frameQuality: 0.93,
            overlay: 'border', // solid | lines | border
            color: '#FFF',
        });
        this.currentSlide.render();
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyboardPress);
    }

    slideLeft = () => {
        const { currentSlide } = this.state;

        let nextSlide = currentSlide - 1;
        if (nextSlide < 0) {
            nextSlide = 0;
        }

        if (nextSlide !== currentSlide) {
            this.setState({ currentSlide: nextSlide });
        }
    };

    slideRight = () => {
        const { items } = this.props;
        const { currentSlide } = this.state;

        let nextSlide = currentSlide + 1;
        if (nextSlide > items.length - 1) {
            nextSlide = items.length - 1;
        }

        if (nextSlide !== currentSlide) {
            this.setState({ currentSlide: nextSlide });
        }
    };

    handleKeyboardPress = (e) => {
        if (e.key === 'ArrowLeft') {
            this.slideLeft();
        } else if (e.key === 'ArrowRight') {
            this.slideRight();
        }
    };

    slideRefresh = () => {
        this.currentSlide.rerender();
    };

    renderSlide = (item, key) => {
        const { currentSlide } = this.state;

        return (
            <div
                key={key}
                ref={(el) => {
                    if (currentSlide === key) {
                        this.currentSlideEl = el;
                    }
                }}
                className={styles.pluginPackGenerator_sliderItem}
            >
                {item.generateTime}
            </div>
        );
    };

    render() {
        const { items } = this.props;
        const { currentSlide } = this.state;
        const containerStyle = {
            width: items.length * SLIDER_WIDTH,
            left: -(currentSlide * SLIDER_WIDTH),
        };

        if (!items.length) {
            return null;
        }

        return (
            <div className={styles.pluginPackGenerator_sliderContainer}>
                <div className={styles.pluginPackGenerator_sliderArrow}>
                    <Ico icoType="angle-left" />
                    <div
                        className={styles.pluginPackGenerator_sliderBlocker}
                        onClick={this.slideLeft}
                    />
                </div>
                <div className={styles.pluginPackGenerator_sliderWrapper}>
                    <div className={styles.pluginPackGenerator_slider} style={containerStyle}>
                        { items.map(this.renderSlide) }
                    </div>
                </div>
                <div
                    className={cn(
                        styles.pluginPackGenerator_sliderArrow,
                        styles.pluginPackGenerator_sliderArrowRight
                    )}
                >
                    <Ico icoType="angle-right" />
                    <div
                        className={styles.pluginPackGenerator_sliderBlocker}
                        onClick={this.slideRight}
                    />
                </div>
                <div className={styles.pluginPackGenerator_sliderRefresh}>
                    <Ico icoType="repeat" />
                    <div
                        className={styles.pluginPackGenerator_sliderBlocker}
                        onClick={this.slideRefresh}
                    />
                </div>
                <div className={styles.pluginPackGenerator_sliderCounter}>
                    {currentSlide + 1}
                    /
                    {items.length}
                </div>
            </div>
        );
    }
}

Slider.propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
        author: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
        generateTime: PropTypes.number.isRequired,
    })).isRequired,
};
