import React, { Component } from "react";
import { Button, Image, StyleSheet, Text, View } from "react-native";
import { observable, computed, action } from "mobx";
import { observer } from "mobx-react/native";
import { boundMethod } from "autobind-decorator";
import { useObserver } from "mobx-react-lite";
import {
  ImageBackground,
  Animated,
  TouchableWithoutFeedback,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ScrollView,
  RefreshControl,
  Alert
} from "react-native";
import {
  useState,
  useEffect,
  useMemo,
  useDebugValue,
  useImperativeHandle,
  forwardRef
} from "react";
import { TouchableView } from "./components/common/TouchableView";
import sizes from "./style/sizes";
import colors from "./style/colors";
import mixins from "./style/mixins";
import { IChildrenProps } from "./types/props";


// TestStore
const defaultLikeButtonOpacity: number = 1;
const defaultHeight: number = 100;
const defaultWidth: number = 80;

class TestStore {
  @observable opacity: Animated.Value = new Animated.Value(1);
  @observable height: Animated.Value = new Animated.Value(100);
  @observable width: Animated.Value = new Animated.Value(80);

  @observable collapse: boolean = false;

  @observable isRefreshing: boolean = false;

  @observable dataList: Array<ListItem> = [];

  @observable maxNum: number = 0;

  private startBackgroundAnimate() {
    Animated.parallel([
      Animated.timing(this.opacity, {
        toValue: this.collapse ? 0 : defaultLikeButtonOpacity,
        duration: 166
      }),
      Animated.timing(this.height, {
        toValue: this.collapse ? 40 : defaultHeight,
        duration: 166
      }),
      Animated.timing(this.width, {
        toValue: this.collapse ? 200 : defaultWidth,
        duration: 166
      })
    ]).start();
  }

  private loadMore() {
    let newArray: Array<ListItem> = Array.from(new Array(20)).map((x, i) => ({
      id: i + this.maxNum,
      name: `this is name-${i + this.maxNum}`
    }));
    this.maxNum = this.dataList.length;
    console.log(this.dataList);
    this.dataList.push(...newArray);
    this.maxNum += newArray.length;
  }

  @action.bound
  public toggleBox() {
    this.collapse = !this.collapse;
    this.startBackgroundAnimate();
  }

  @action.bound
  public initList() {
    this.dataList = Array.from(new Array(20)).map((x, i) => ({
      id: i,
      name: `this is name-${i}`
    }));
    this.maxNum = this.dataList.length;
    console.log(this.dataList);
  }

  @action.bound
  public onRefresh() {
    this.isRefreshing = true;
    Alert.alert(
      "Alert Title",
      String(this.isRefreshing),
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => console.log("OK Pressed") }
      ],
      { cancelable: false }
    );
    setTimeout(() => {
      this.dataList = Array.from(new Array(20)).map((x, i) => ({
        id: i + 100,
        name: `this is new name-${i}`
      }));
      console.log(this.dataList);
      this.isRefreshing = false;
    }, 1500);
  }

  @action.bound
  public contentScrollLoadMore(e: any) {
    var offsetY = e.nativeEvent.contentOffset.y; // 已经滚动的距离
    var oriageScrollHeight = e.nativeEvent.layoutMeasurement.height; // 可滚动的可见区域高度
    var contentSizeHeight = Math.round(e.nativeEvent.contentSize.height); // 可滚动的总高度
    if (Math.round(offsetY + oriageScrollHeight) >= contentSizeHeight) {
    }
    this.loadMore();
  }

  @action
  // 提示框
  public alert = (text: string) => {
    Alert.alert(
      "通知",
      text,
      [{ text: "知道了", onPress: () => console.log("OK Pressed") }],
      { cancelable: false }
    );
  };
}

var obStyles = observable({
  get styles() {
    return StyleSheet.create({
      container: {
        // flex: 1,
        backgroundColor: colors.background
      },
      boxWrapper: {
        alignItems: "center"
      },
      box: {
        backgroundColor: colors.red
      },
      buttonWrapper: {
        marginTop: 20,
        alignItems: "center"
      },
      toggleButton: {
        justifyContent: "center",
        height: 32,
        borderRadius: 10,
        paddingHorizontal: sizes.goldenRatioGap,
        backgroundColor: colors.textDefault
      },
      toggleButtonText: {
        color: colors.textMuted
      },
      redViewStyle: {
        height: 50,
        backgroundColor: "pink",
        marginTop: 10,
        borderStyle: "solid",
        borderWidth: 2,
        borderColor: "orange",
        borderRadius: 20
      },
      greenViewStyle: {
        height: 50,
        width: 50,
        borderRadius: 50 / 2,
        backgroundColor: "lightblue",
        alignSelf: "center"
      },
      textSpanWrap: {
        height: 50,
        backgroundColor: "yellow",
        justifyContent: "center",
        alignItems: "center"
      },
      textSpan: {
        width: 50,
        backgroundColor: "red",
        textAlign: "center"
      },
      scrollViewWrapper: {
        backgroundColor: "pink",
        overflow: "hidden",
        height: 100,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10
      },
      DataItemText: {
        fontSize: 14
      }
    });
  }
});

// Store
export const testStore = new TestStore();
// styles
const { styles } = obStyles;

export interface IChildrenProps {
  children: React.ReactNode | React.ReactNode[];
}

export interface ListItem {
  id: number;
  name: string;
}

// interface IDataListProp extends IChildrenProps {
//   dataList: Array<ListItem>;
// }

interface IDataListProp {
  dataList: Array<ListItem>;
}
const DataList = (props: IDataListProp): JSX.Element => {
  return useObserver(() => {
    return (
      <View>
        {props.dataList.map((item: ListItem) => {
          return <ListItem key={item.id} listItem={item} />;
        })}
      </View>
    );
  });
};

interface IListItemProp {
  listItem: ListItem;
}
const ListItem = (props: IListItemProp): JSX.Element => {
  return <Text style={styles.DataItemText}>{props.listItem.name}</Text>;
};

const App = () => {
  //生命周期中的componentDidMount
  useEffect(() => {

    testStore.initList();
    console.log("componentDidMount");
  }, []);

  return useObserver(() => {
    return (
      <View style={styles.container}>
        <View style={styles.boxWrapper}>
          <Animated.View
            style={[
              styles.box,
              {
                opacity: testStore.opacity,
                height: testStore.height,
                width: testStore.width
              }
            ]}
          />
        </View>

        <View style={styles.buttonWrapper}>
          <TouchableView
            style={styles.toggleButton}
            onPress={testStore.toggleBox}
          >
            <Text style={styles.toggleButtonText}>切换开关</Text>
          </TouchableView>
        </View>

        <View>
          <View style={styles.redViewStyle} />
          <View style={styles.greenViewStyle} />
        </View>

        <View
          onPress={() => {
            testStore.alert("fff");
          }}
          style={styles.textSpanWrap}
        >
          <Text style={styles.textSpan}>大顶堆</Text>
        </View>

        <ScrollView
          style={styles.scrollViewWrapper}
          onScroll={testStore.contentScrollLoadMore} // 获取滑动数据
          // 当ScrollView处于竖直方向的起点位置(scrollY: 0)，此时下拉会触发一个onRefresh事件。
          refreshControl={
            <RefreshControl
              refreshing={testStore.isRefreshing}
              onRefresh={testStore.onRefresh}
              tintColor="#ffffff" // 指定刷新指示器的背景色(iOS)
              title="刷新中..." // 指定刷新指示器下显示的文字(iOS)
              titleColor="#000000" // 指定刷新指示器下显示的文字的颜色(iOS)
              colors={["#ff0000", "#00ff00", "#0000ff"]} // 刷新指示器在刷新期间的过渡颜色(Android)
              progressBackgroundColor="#ffffff" // 指定刷新指示器的背景色(Android)
            />
          }
        >
          <DataList dataList={testStore.dataList} />
        </ScrollView>
      </View>
    );
  });
};

export default App;
