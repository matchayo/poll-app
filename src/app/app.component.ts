import { Component } from '@angular/core';
import { io } from 'socket.io-client';
import { ChartType, ChartOptions } from 'chart.js';
import {
  SingleDataSet,
  Label,
  monkeyPatchChartJsLegend,
  monkeyPatchChartJsTooltip,
} from 'ng2-charts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'PollApp';
  socket: any;
  teamsObj: any;
  total: number = 0;
  value: number = 0;
  quantity: number = 0;

  public pieChartOptions: ChartOptions = {
    responsive: true,
  };

  public pieChartLabels: Label[] = [];
  public pieChartData: SingleDataSet = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];

  constructor() {
    this.socket = io(); // Sends a Socket.io connection request
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }

  ngOnInit() {
    this.onGetTeamsObj();
    this.onChart();
  }

  onGetTeamsObj() {
    this.socket.on("getTeamsObj", (teamsObj: any) => {
      this.teamsObj = teamsObj;
      this.total = teamsObj.total;
      this.onChart();
    });
  }

  onNewPurchase() {
    this.socket.emit("newPurchase", {
      value: this.value,
      quantity: this.quantity
    });
  }

  onChart() {
    this.pieChartLabels = [];
    this.pieChartData = [];

    this.teamsObj.teams.forEach((team: any) => {
      this.pieChartLabels.push(team.text);
      this.pieChartData.push(team.count);
    });
  }
}
