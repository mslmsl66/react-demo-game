import React from 'react';

function FancyBorder(props) {
  // 类似Vue slot，父组件使用时传入渲染
  return (
    <div className={'FancyBorder FancyBorder-' + props.color}>
      {props.children}
    </div>
  );
}

export default function WelcomeDialog() {
  return (
    // slot内容是h1和p，作为插槽
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        Welcome
      </h1>
      <p className="Dialog-message">
        Thank you for visiting our spacecraft!
      </p>
    </FancyBorder>
  );
}