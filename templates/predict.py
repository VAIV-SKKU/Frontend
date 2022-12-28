from keras.models import load_model
import sys
import os
from collections import defaultdict
import numpy as np
import scipy.misc
import imageio
import cv2
import pickle
import argparse
import time
from copyreg import constructor
import tensorflow as tf
from datetime import timedelta
from datetime import datetime

import pandas as pd
import matplotlib.pyplot as plt

os.environ["CUDA_DEVICE_ORDER"] = "PCI_BUS_ID"
os.environ["CUDA_VISIBLE_DEVICES"] = "0"
config = tf.compat.v1.ConfigProto()
config.gpu_options.allow_growth = True
sess = tf.compat.v1.Session(config=config)


def make_plot(ticker, day):
    tic = 'A' + ticker
    data = pd.read_csv(f'/home/ubuntu/2022_VAIV_Dataset/Stock_Data/Kospi_Data/{tic}.csv')
    last_day = datetime.strptime(day, "%Y-%m-%d") + timedelta(days=-1)
    pred_day = last_day + timedelta(days=1)

    ###########################################
    graph_x = []
    graph_y = []
    pred_graph_x = []
    pred_graph_y = []

    csv_date = last_day
    csv_date = csv_date.strftime('%Y%m%d')
    csv_row = data[data['date'] == int(csv_date)]
    index = int(csv_row.values[0][0])

    for i in range(20):
        r = data.loc[data['Unnamed: 0'] == index + i - 19]
        print(r)
        csv_close = float(r.values[0][5])
        csv_d = int(r.values[0][1])
        graph_y.append(csv_close)
        graph_x.append(str(csv_d))
    plt.figure(figsize=(20, 10))
    r = data.loc[data['Unnamed: 0'] == index]
    csv_close = float(r.values[0][5])
    csv_d = int(r.values[0][1])
    pred_graph_y.append(csv_close)
    pred_graph_x.append(str(csv_d))

    csv_pdate = pred_day.strftime('%Y%m%d')
    csv_prow = data[data['date'] == int(csv_pdate)]
    csv_pclose = float(csv_prow.values[0][5])
    pred_graph_x.append(str(csv_pdate))
    pred_graph_y.append(csv_pclose)
    print('gragh_x: ', graph_x)
    print('graph_y: ', graph_y)
    print('pred_graph_x: ', pred_graph_x)
    print('pred_graph_y: ', pred_graph_y)
    plt.plot(graph_x, graph_y, 'b')
    plt.plot(pred_graph_x, pred_graph_y, 'r')
    plt.title('Stock Graph')
    plt.xticks(rotation=45)
    plt.rc('xtick', labelsize=20)
    plt.rc('ytick', labelsize=20)
    plt.locator_params(axis='x', nbins=3)
    plt.show()


def runPython():
    print("you clicked me")
    make_plot('005930', '2019-04-02')


if __name__ == "__main__":
    function_proxy = create_proxy(runPython)
    e = document.getElementById("button")
    e.addEventListener("click", function_proxy)
    main()
