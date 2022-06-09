import { useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip as Tool } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import cn from "./PieChart.module.scss";
import cx from "classnames";
import { labels, datapoints, colors, overview } from "./data";
import { ReactComponent as ClickIcon } from "../../icons/Click-Here.svg";
import Overview from "./Overview";

ChartJS.register(ArcElement, Tool);

const PieChart = () => {
  const [activeArc, activeArcSet] = useState({});
  const [computedColors, computedColorsSet] = useState(colors);

  const data = {
    labels,
    _datasets: [
      {
        label: "Mittelherkunft",
        data: datapoints,
        backgroundColor: computedColors,
        hoverBackgroundColor: computedColors,
        borderWidth: 0,
        weight: 35,
      },
      {
        data: [100],
        backgroundColor: colors[activeArc.index],
        hoverBackgroundColor: colors[activeArc.index],
        borderWidth: 0,
        weight: activeArc.label ? 10 : 0,
      },
    ],
    get datasets() {
      return this._datasets;
    },
    set datasets(value) {
      this._datasets = value;
    },
  };

  const onChartClick = (_, elements) => {
    const elementIndex = elements[0].index;
    activeArcSet({
      label: labels[elementIndex],
      index: elementIndex,
    });
    computedColorsSet(
      colors.map((color, index) =>
        index === elementIndex ? color : `${color}40`
      )
    );
  };

  const onChartHover = (event, chartElement) => {
    if (chartElement[0]) {
      event.native.target.style.cursor = "pointer";
    } else {
      event.native.target.style.cursor = "default";
    }
  };

  const onClickIconClick = () => {
    activeArcSet({
      label: labels[0],
      index: 0,
    });
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    events: ["click", "mousemove"],
    onClick: (_, elements) => onChartClick(_, elements),
    onHover: (e, el) => onChartHover(e, el),
    cutout: "55%",
  };

  return (
    <div className={cn.wrapper}>
      <h2 className={cn.title}>Unsere Mittelherkunft</h2>
      <p className={cn.subTitle}>
        Für ihre Arbeit stehen der Technologiestiftung Erträge aus dem
        Stiftungskapital zur Verfügung. Darüber hinaus führt sie viele ihrer
        Projekte mit Mitteln verschiedener Fördergeber durch.
      </p>
      <div className={cn.doughnutWrapper}>
        <Doughnut data={data} options={options} />
        {activeArc.label ? (
          <div className={cn.infoBox}>
            <div className={cn.doner}>{activeArc.label}</div>
            <div className>{datapoints[activeArc.index]} T€</div>
          </div>
        ) : (
          <div
            className={cx(cn.infoBox, cn.clickIcon)}
            onClick={onClickIconClick}
          >
            <ClickIcon />
          </div>
        )}
      </div>
      <Overview data={overview} />
    </div>
  );
};

export default PieChart;
