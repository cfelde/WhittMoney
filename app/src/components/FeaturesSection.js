import React from "react";
import Section from "./Section";
import SectionHeader from "./SectionHeader";
import Features from "./Features";

function FeaturesSection(props) {
  return (
    <Section
      color={props.color}
      size={props.size}
      backgroundImage={props.backgroundImage}
      backgroundImageOpacity={props.backgroundImageOpacity}
    >
      <div className="container">
        <SectionHeader
          title={props.title}
          subtitle={props.subtitle}
          size={3}
          spaced={true}
          className="has-text-centered"
        ></SectionHeader>
        <Features
          items={[
            {
              title: "Instant Swaps",
              description:
                "Integer ornare neque mauris, ac vulputate lacus venenatis et. Pellentesque ut ultrices purus.",
              image: require("../assets/undraw_transfer_money_rywa.svg")
            },
            {
              title: "Invest",
              description:
                "Integer ornare neque mauris, ac vulputate lacus venenatis et. Pellentesque ut ultrices purus.",
              image:
                require("../assets/undraw_investing_7u74.svg")
            },
            {
              title: "Decentralized",
              description:
                "Integer ornare neque mauris, ac vulputate lacus venenatis et. Pellentesque ut ultrices purus.",
              image: require("../assets/undraw_connected_world_wuay.svg")
            },
            {
              title: "Save",
              description:
                "Integer ornare neque mauris, ac vulputate lacus venenatis et. Pellentesque ut ultrices purus.",
              image: require("../assets/undraw_Savings_dwkw.svg")
            }
          ]}
        ></Features>
      </div>
    </Section>
  );
}

export default FeaturesSection;
