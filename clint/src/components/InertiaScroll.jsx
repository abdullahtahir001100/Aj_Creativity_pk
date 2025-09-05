import React, { Component } from 'react';

class InertiaScroll extends Component {
  constructor(props) {
    super(props);
    // Initialize state
    this.state = {
      current: 0,
      target: 0,
      ease: 0.1,
    };
    // Create a ref for the container element
    this.containerRef = React.createRef();
    // Bind methods to the class instance
    this.handleWheel = this.handleWheel.bind(this);
    this.animate = this.animate.bind(this);
  }

  // Lifecycle method called after component mounts
  componentDidMount() {
    window.addEventListener('wheel', this.handleWheel, { passive: true });
    this.animate();
  }

  // Lifecycle method called before component unmounts
  componentWillUnmount() {
    window.removeEventListener('wheel', this.handleWheel);
    cancelAnimationFrame(this.animationFrameId);
  }

  // Handle wheel events to update the target scroll position
  handleWheel(e) {
    this.setState((prevState) => {
      const newTarget = prevState.target + e.deltaY;
      const maxScroll = this.containerRef.current.scrollHeight - window.innerHeight;
      return {
        target: Math.max(0, Math.min(newTarget, maxScroll)),
      };
    });
  }

  // Animation loop
  animate() {
    this.setState((prevState) => {
      const newCurrent = prevState.current + (prevState.target - prevState.current) * prevState.ease;
      if (this.containerRef.current) {
        this.containerRef.current.style.transform = `translateY(${-newCurrent}px)`;
      }
      return {
        current: newCurrent,
      };
    });
    this.animationFrameId = requestAnimationFrame(this.animate);
  }

  // Render method to display the component's UI
  render() {
    return (
      <div className="scroll-container" ref={this.containerRef}>
        {this.props.children}
      </div>
    );
  }
}

export default InertiaScroll;