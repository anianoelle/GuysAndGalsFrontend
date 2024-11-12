import React from 'react';
import classnames from 'classnames';

class Carousel extends React.Component {
  state = {
    currentSlide: 0
  };
  autoplay = null;

  componentDidMount() {
    if (this.props.autoplay && !this.autoplay) {
      this.startAutoplay();
    }
  }

  componentDidUpdate() {
    if (this.props.autoplay && !this.autoplay) {
      this.startAutoplay();
    }
  }

  componentWillUnmount() {
    if (this.autoplay) {
      clearInterval(this.autoplay);
    }
  }

  handleAutoplay = () => {
    if (this.state.currentSlide === this.props.children.length - 1) {
      this.setState({ currentSlide: 0 });
    } else {
      this.setState({ currentSlide: this.state.currentSlide + 1 });
    }
  };

  startAutoplay() {
    const interval = this.props.interval || 5000;
    this.autoplay = setInterval(this.handleAutoplay, interval);
  }

  selectSlide(n) {
    this.setState({ currentSlide: n });
  }

  handleClick(index) {
    return () => this.selectSlide(index);
  }

  renderDots() {
    return this.props.children.map((item, index) => {
      const cn = classnames('dot', {
        active: this.state.currentSlide === index
      });
      return <button onClick={this.handleClick(index)} className={cn} />;
    });
  }

  assignLeft(index) {
    if (this.state.currentSlide === 0) {
      return index === this.props.children.length - 1;
    }

    return index === this.state.currentSlide - 1;
  }

  assignRight(index) {
    if (this.state.currentSlide === this.props.children.length - 1) {
      return index === 0;
    }

    return index === this.state.currentSlide + 1;
  }

  render() {
    const { currentSlide } = this.state;
    return (
      <div className='h-[100%] w-[60%] flex items-center justify-center flex-col relative'>
        <div className="slides">
          {this.props.children.map((slide, index) => {
            const cn = classnames(
              'slide',
              { left: this.assignLeft(index) },
              { center: index === currentSlide },
              { right: this.assignRight(index) }
            );
            return (
              <button onClick={this.handleClick(index)} className={cn}>
                <div>{slide}</div>
              </button>
            );
          })}   
        </div>
        <div>{this.renderDots()}</div>
      </div>
    );
  }
}

export default Carousel;
