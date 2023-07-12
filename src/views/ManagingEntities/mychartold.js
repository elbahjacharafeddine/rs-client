import React, { Component } from "react";
import OrgChart from "@balkangraph/orgchart.js";
import "../../assets/css/orgChart.css";

import { OrganizationChart } from 'primereact/organizationchart';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';

export default class extends Component {
  constructor(props) {
    super(props);
    this.divRef = React.createRef();
  }

  shouldComponentUpdate() {
    return false;
  }
  user = localStorage.getItem("user");
  pdf(nodeId) {
    // this.chart.exportPDF({
    //     format: "A4",
    //     header: 'My Header',
    //     footer: 'My Footer. Page {current-page} of {total-pages}'
    // });
  }
  componentDidMount() {
    var printIcon = '<img src="https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/print-512.png">'
    let that = this;
    OrganizationChart.templates.diva.field_1 = '<text  style="font-size: 14px;"  x="102" y="144" text-anchor="middle">{val}</text>';
    OrganizationChart.templates.group.field_0 = '<text  style="font-size: 24px;"  x="70" y="35" >{val}</text>';
    OrganizationChart.templates.group.link = '<path stroke-linejoin="round" stroke="#aeaeae" stroke-width="1px" fill="none" d="M{xa},{ya} {xb},{yb} {xc},{yc} L{xd},{yd}" />';
    OrganizationChart.templates.group.min = Object.assign({}, OrganizationChart.templates.group);
    OrganizationChart.templates.group.min.imgs = "{val}";
    OrganizationChart.templates.group.min.description = '<text width="230" text-overflow="multiline" style="font-size: 14px;" fill="#aeaeae" x="125" y="100" text-anchor="middle">{val}</text>';
    OrganizationChart.templates.diva.plus = "";
    OrganizationChart.templates.diva.minus = "";
    OrganizationChart.templates.diva.exportMenuButton = '<div style="position:absolute;right:{p}px;top:{p}px; width:40px;height:50px;cursor:pointer" control-export-menu=""  >' + printIcon + "</div>";
    this.chart = new OrganizationChart(this.divRef.current, {
      layout: OrganizationChart.tree,
      nodes: this.props.nodes,
      scaleInitial: OrganizationChart.match.boundary,
      nodeMouseClick: OrganizationChart.action.expandCollapse,
      template: "diva",
      enableSearch: false,
      mouseScrool: OrganizationChart.action.none,
      sticky: false,
      nodeBinding: {
        imgs: function (sender, node) {
          if (node.min) {
            var val = "";
            var count = node.stChildrenIds.length > 5 ? 5 : node.stChildrenIds.length;
            var x = node.w / 2 - (count * 32) / 2;

            for (var i = 0; i < count; i++) {
              var data = sender.get(node.stChildrenIds[i]);
              val += '<image xlink:href="' + data.img + '" x="' + (x + i * 32) + '" y="45" width="32" height="32" ></image>';
            }
            return val;
          }
        },
        field_0: "name",
        field_1: "title",
        description: "description",
        img_0: "img",
      },
      menu: {
        pdfWithTitle: {
          text: "Imprimer l'arborescence",
          icon: OrganizationChart.icon.pdf(24, 24),
          onClick: function () {
            this.exportPDF({
              filename: `${that.props.fileName}.pdf`,
              header: that.props.name,
              footer: "",
              format: "A4",
              margin: [60, 20, 60, 20],
            });
          },
        },
      },
      tags: {
        group: {
          template: "group",
        },
        "members-group": {
          subTreeConfig: {
            columns: 3,
          },
        },
      },
    });
   
  }

  render() {
    return <div id="tree" ref={this.divRef}></div>;
  }
}
