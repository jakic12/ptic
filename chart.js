// useless file: test chart style here
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const ChartDataLabels = require('chartjs-plugin-datalabels');
const fs = require('fs');


const canvas = new ChartJSNodeCanvas({
        width: 400,
        height: 300,
        backgroundColour: 'white',
        chartCallback: (ChartJS) => {
            ChartJS.register(ChartDataLabels);
        }
    });

async function pie(hist) {
    const total_time = Object.values(hist).reduce((acc, v) => acc+v);
    const configuration = {
        type: 'pie',
        data: {
            labels: Object.keys(hist),
            datasets: [{
                data: Object.values(hist).map(x => x * 100 / total_time),
            }],
        },
        options: {
            responsive: false,
            animation: false,
            plugins: {
                legend: {
                    display: false,
                    // position: "top",
                    // labels: {
                    //     pointStyle: "circle",
                    //     font: {
                    //         size: 14,
                    //         weight: "bold"
                    //     }
                    // }
                },
                datalabels: {
                    color: '#333333',
                    font: {
                        size: 14,
                        weight: "bold",
                        anchor: "end",
                    },
                    
                    formatter: (value, context) => {
                        return context.chart.data.labels[context.dataIndex];
                    }
                }
            }
        },
    };

    return await canvas.renderToBuffer(configuration);
}

const example_hist = { 'aaa': 52314, 'bcccc': 6705, 'bb': 26969 };
pie(example_hist).then(png => {
    console.log(Buffer.isBuffer(png));
    console.log(png.length);
    fs.writeFileSync('chart.png', png);
});

// creating 2 charts consecutively fails if canvas is not global
// async function main() {
//     const png1 = await pie(example_hist);
//     console.log(Buffer.isBuffer(png1));
//     console.log(png1.length);
//     fs.writeFileSync('chart1.png', png1);

//     const png2 = await pie(example_hist);
//     console.log(Buffer.isBuffer(png2));
//     console.log(png2.length);
//     fs.writeFileSync('chart2.png', png2);
// }

// main().catch(console.error);


