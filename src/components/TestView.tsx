import React, { Component } from "react";
import { SetStateAction, Dispatch } from 'react'
import {
	Button, Image, StyleSheet, Text, View, StyleProp, TextStyle, KeyboardAvoidingView, TextInput, TouchableHighlight,
	TouchableOpacity,
	ImageBackground,
	Animated,
	TouchableWithoutFeedback,
	NativeSyntheticEvent,
	NativeScrollEvent,
	FlatList,
	ScrollView,
	RefreshControl,
	Alert,
	Keyboard,
	Modal
} from "react-native";
import { observable, computed, action } from "mobx";
import { observer } from "mobx-react/native";
import { boundMethod } from "autobind-decorator";
import { useObserver } from "mobx-react-lite";
import { screen } from '@app/style/sizes'

import {
	useState,
	useEffect,
	useMemo,
	useDebugValue,
	useImperativeHandle,
	forwardRef
} from "react";
import { TouchableView } from "@app/components/common/TouchableView";
import sizes from "@app/style/sizes";
import colors from "@app/style/colors";
import mixins from "@app/style/mixins";
import { IChildrenProps } from "@app/types/props";


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
		// 滚动至底部
		if (Math.round(offsetY + oriageScrollHeight) >= contentSizeHeight) {
			this.loadMore();
		}
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
				flex: 1,
				backgroundColor: colors.background,
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
				borderWidth: 1,
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
				height: 150,
			},

			DataItemText: {
				fontSize: 20
			},

			scrollWrapper: {
				backgroundColor: "pink",
				width: screen.width - 20,
				alignSelf: 'center',
				borderWidth: 1,
				borderRadius: 20,
				borderColor: 'gray',
				overflow: 'hidden'
			},

			leftRightScrollItemWrapper: {
				// 消除两边border宽度影响
				width: screen.width - 20 - 4,
				justifyContent: 'center',
				alignItems: 'center',
			},

			TextInputStyle: {
				margin: 10,
				padding: 0,
				height: 50,
				borderColor: 'green',
				borderWidth: 1,
				borderRadius: 5,
				fontSize: 16,
				color: '#000000',
				paddingLeft: 10,
				backgroundColor: '#FFFFFF'
			},

			buttonStyle: {
				justifyContent: 'center',
				borderColor: '#000000',
				backgroundColor: '#DDDDDD',
				borderWidth: 1,
				borderRadius: 10,
				margin: 20,
				height: 50
			},
			textStyle: {
				fontSize: 16,
				color: '#000000',
				alignSelf: 'center'
			},

			// FlatList
			flatListStyle: {
				height: 200
			},
			headerViewStyle: {
				height: 50,
				backgroundColor: '#f4511e',
				justifyContent: 'center',
				alignItems: 'center'
			},
			headerTextStyle: {
				fontSize: 20,
				color: '#FFFFFF'
			},
			itemViewStyle: {
				height: 100,
				borderWidth: 1,
				borderRadius: 10,
				marginTop: 5,
				justifyContent: 'center',
				alignItems: 'center'
			},
			itemTextStyle: {
				color: 'red',
				fontSize: 20
			},
			separatorStyle: {
				borderColor: '#A4A4A4',
				borderBottomWidth: 2,
				marginTop: 5
			},

			// Modal

			modalLayer: {
				backgroundColor: 'rgba(0, 0, 0, 0.45)',
				flex: 1,
				justifyContent: 'center',
				padding: 32
			},
			modalContainer: {
				height: 300,
				backgroundColor: 'white',
				justifyContent: 'center'
			},
			modalTitleStyle: {
				textAlign: 'center',
				fontSize: 26
			},
			modalButtonStyle: {
				paddingLeft: 30,
				paddingRight: 30,
				marginTop: 10
			},
			imgWrapper: {
				margin: 20,
				alignItems: 'center'
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

// ScrollView list
interface IDataListProp {
	dataList: Array<ListItem>;
	style?: StyleProp<TextStyle>;
	isLeftRightScroll?: boolean;
}
const DataList = ({ dataList, style, isLeftRightScroll }: IDataListProp): Array<JSX.Element> | JSX.Element => {
	if (isLeftRightScroll) {

		let result: Array<JSX.Element> = [];
		result = dataList.map((item: ListItem) => {
			return (<View key={item.id} style={isLeftRightScroll ? styles.leftRightScrollItemWrapper : null}>
				<ListItem style={style ? style : null} listItem={item} />
			</View>)
		})
		return useObserver(() => result)
	} else {
		return useObserver(() => {
			return (
				<View>
					{dataList.map((item: ListItem) => {
						return <ListItem key={item.id} listItem={item} />;
					})}
				</View>
			);
		});
	}
};

interface IListItemProp {
	listItem: ListItem;
	style?: StyleProp<TextStyle>
}
const ListItem = ({ listItem, style }: IListItemProp): JSX.Element => {
	return <Text style={[styles.DataItemText,
	style ? style : null
	]}>{listItem.name}</Text>;
};

// interface IDataListProp {
//   dataList: Array<ListItem>;
// }
// const DataList = (props: IDataListProp): JSX.Element => {
//   return useObserver(() => {
//     return (
//       <View>
//         {props.dataList.map((item: ListItem) => {
//           return <ListItem key={item.id} listItem={item} />;
//         })}
//       </View>
//     );
//   });
// };

// interface IListItemProp {
//   listItem: ListItem;
// }
// const ListItem = (props: IListItemProp): JSX.Element => {
//   return <Text style={styles.DataItemText}>{props.listItem.name}</Text>;
// };

const TestView = () => {

	// TextInput
	const [text, setText] = useState('');
	const [keyboardDidShowListener, setKeyboardDidShowListener] = useState();
	const [keyboardDidHideListener, setKeyboardDidHideListener] = useState();

	// FlatList
	const [isRefreshing, setIsRefreshing] = useState(false)
	const [list, setList]: [Array<ListItem>, Dispatch<SetStateAction<Array<ListItem>>>] = useState(new Array<ListItem>())

	// Modal
	const [modalVisible, setMovalVisible] = useState(false)

	// TextInput
	const onChangeTextHandle = (val: string) => {
		setText(val)
	}

	//生命周期中的componentDidMount
	useEffect(() => {

		testStore.initList();
		console.log("componentDidMount");

		setKeyboardDidShowListener(Keyboard.addListener('keyboardDidShow', keyboardDidShow));
		setKeyboardDidHideListener(Keyboard.addListener('keyboardDidHide', keyboardDidHide));

		initFlatList()

		// 生命周期 componentWillUnmount
		return function unmount() {
			keyboardDidShowListener.remove();
			keyboardDidHideListener.remove();
		}
	}, []);

	const initFlatList = () => {
		let list = []
		for (var i = 0; i < 8; i++) {
			list.push({ key: 'key' + (i + 1) });
		}

		setList(list as any)
	}

	const onBlurHandle = () => {
		console.log('失去焦点');
		Keyboard.dismiss()
	}

	const onFocusHandle = () => {
		console.log('得到焦点');
	}

	const onSubmitEditingHandle = () => {
		testStore.alert('提交内容: ' + text);

		console.log('提交内容: ', text);
	}

	const keyboardDidShow = () => {
		console.log('软键盘显示');
	}

	const keyboardDidHide = () => {
		console.log('软键盘隐藏');
	}

	// FlatList
	// 渲染列表项
	interface IFlatListItem {
		key: string
	}

	interface IRenderItemProp {
		index: number;
		item: IFlatListItem
	}
	const renderItem = ({ index, item }: IRenderItemProp) => {
		console.log(index);
		return (
			<View key={item.key} style={styles.itemViewStyle}>
				<Text style={styles.itemTextStyle}>{item.key}</Text>
			</View>
		);
	}

	// 分割线
	const renderSeparator = () => {
		// return (
		// 	class Separator extends Component {
		// 		render() {
		return (
			<View style={styles.separatorStyle} />
		);
	}
	// 		}
	// 	);
	// }

	// 没数据时显示
	const renderListEmptyComp = () => {
		return (
			<View>
				<Text>没有数据</Text>
			</View>
		);
	}

	// 底部加载
	const onEndReached = () => {
		setIsRefreshing(true)
		// 关于更新state里数组的两种方式
		//setState({ 'arrary': [...this.state.array, newItem]}).
		//setState({ 'array' : [...this.state.array].concat(newList|newItem)}).
		let newList: Array<IFlatListItem> = [];
		for (var i = 0; i < 3; i++) {
			newList.push({ key: '(new)key' + Math.floor(Math.random() * 10000) });
		}

		setTimeout(() => {
			setList([
				...list,
				...newList
			] as React.SetStateAction<ListItem[]>)
			setIsRefreshing(false)

		}, 2000);
	}

	// 顶部加载
	const onRefresh = () => {
		setIsRefreshing(true)
		setTimeout(() => {
			setIsRefreshing(false)
			let newList: Array<IFlatListItem> = [];
			for (var i = 0; i < 3; i++) {
				newList.push({ key: '(new)key' + Math.floor(Math.random() * 10000) });
			}
			setList([...newList as any])
			// this.myFlatList.scrollToEnd(); // 滚动到底部
			// this.myFlatList.scrollToIndex({animated: true, index:10}); // 将位于索引值为index的元素滚动到可视区域首行位置
			// this.myFlatList.flashScrollIndicators(); // 短暂地显示滚动指示器
		}, 2000);
	}

	// 打开模态框
	const openModalWin = () => {
		setMovalVisible(true)
	}

	const closeModalWin = () => {
		setMovalVisible(false)
	}

	return useObserver(() => {
		return (
			// TODO: Fix error in ScrollView
			// <TouchableWithoutFeedback
			// 	onPress={onBlurHandle}
			// >
			<View style={styles.container}
			>
				<ScrollView>

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
							<Text style={styles.toggleButtonText}>切换的开关</Text>
						</TouchableView>
					</View>

					<View>
						<View style={styles.redViewStyle} />
						<View style={styles.greenViewStyle} />
					</View>

					<View
						style={styles.textSpanWrap}
					>
						<TouchableView
							onPress={() => {
								testStore.alert("fff");
							}}
							style={styles.toggleButton}
						>
							<Text style={styles.textSpan}>大顶堆</Text>
						</TouchableView>
					</View>
					<Text style={{ textAlign: 'center' }}>loadMore</Text>

					{/* Scroll View */}
					<View style={styles.scrollWrapper}>
						<ScrollView
							style={styles.scrollViewWrapper}
							onScroll={testStore.contentScrollLoadMore} // 获取滑动数据
							// 当ScrollView处于竖直方向的起点位置(scrollY: 0)，此时下拉会触发一个onRefresh事件。
							contentContainerStyle={{ padding: 10 }}
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

					<Text style={{ textAlign: 'center' }}>left right scroll</Text>

					{/* Horizontal Scroll */}
					<View style={styles.scrollWrapper}>
						<ScrollView
							style={styles.scrollViewWrapper}
							horizontal={true}
							pagingEnabled={true}
						>
							<DataList isLeftRightScroll={true} style={{ fontSize: 30 }} dataList={testStore.dataList} />
						</ScrollView>
					</View>

					{/* FlatList */}
					<Text style={{ textAlign: 'center' }}>FlatList</Text>
					<View style={styles.scrollWrapper}>
						<FlatList
							style={styles.flatListStyle}
							// ref={(view) => { this.myFlatList = view; }}
							data={list as any} // 数据源
							renderItem={renderItem} // 从数据源中挨个取出数据并渲染到列表中
							showsVerticalScrollIndicator={false} // 当此属性为true的时候，显示一个垂直方向的滚动条，默认为: true
							showsHorizontalScrollIndicator={false} // 当此属性为true的时候，显示一个水平方向的滚动条，默认为: true
							ItemSeparatorComponent={renderSeparator} // 行与行之间的分隔线组件。不会出现在第一行之前和最后一行之后
							ListEmptyComponent={renderListEmptyComp} // 列表为空时渲染该组件。可以是 React Component, 也可以是一个 render 函数，或者渲染好的 element
							onEndReachedThreshold={0.01} // 决定当距离内容最底部还有多远时触发onEndReached回调，范围0~1，如0.01表示触底时触发
							onEndReached={onEndReached} // 在列表底部往下滑时触发该函数。表示当列表被滚动到距离内容最底部不足onEndReachedThreshold的距离时调用
							refreshControl={
								<RefreshControl
									refreshing={isRefreshing} // 在等待加载新数据时将此属性设为 true，列表就会显示出一个正在加载的符号
									onRefresh={onRefresh} // 在列表顶部往下滑时触发该函数。如果设置了此选项，则会在列表头部添加一个标准的RefreshControl控件，以便实现“下拉刷新”的功能
									tintColor="#ffffff" // 指定刷新指示器的背景色(iOS)
									title="加载中..." // 指定刷新指示器下显示的文字(iOS)
									titleColor="#000000" // 指定刷新指示器下显示的文字的颜色(iOS)
									colors={['#ff0000', '#00ff00', '#0000ff']} // 刷新指示器在刷新期间的过渡颜色(Android)
									progressBackgroundColor="#ffffff" // 指定刷新指示器的背景色(Android)
								/>
							}
						>
						</FlatList>
					</View>

					{/* TextInput */}
					<KeyboardAvoidingView behavior="padding" enabled >
						<View>
							<TextInput
								style={styles.TextInputStyle}
								value={text}
								placeholder="请输入搜索内容"
								placeholderTextColor='#A4A4A4'
								editable={true} // 是否可编辑，默认为: true
								secureTextEntry={false} // 是否为密码，默认为: false
								keyboardType='default' // 弹出键盘类型
								maxLength={10} // 限制文本框中最多的字符数
								multiline={false} // 是否为多行文本，默认为: false
								onChangeText={onChangeTextHandle} // 文本变化事件
								onBlur={onBlurHandle} // 失去焦点事件
								onFocus={onFocusHandle} // 得到焦点事件
								onSubmitEditing={onSubmitEditingHandle} // 提交编辑内容事件
							/>
						</View>
					</KeyboardAvoidingView>

					{/* Touchable */}
					<TouchableHighlight
						style={styles.buttonStyle}
						onPress={() => {
							testStore.alert("fff");
						}}
						// onPressIn={this._onPressIn}
						// onPressOut={this._onPressOut}
						// onLongPress={this._onLongPress}
						activeOpacity={0.85}
						delayLongPress={3800}
						underlayColor='white'
					>
						<Text style={styles.textStyle}>TouchableHighlight</Text>
					</TouchableHighlight>

					<TouchableOpacity
						style={styles.buttonStyle}
						onPress={() => {
							testStore.alert("fff");
						}}
						// onPressIn={this._onPressIn}
						// onPressOut={this._onPressOut}
						// onLongPress={this._onLongPress}
						delayLongPress={3800}
						activeOpacity={0.2}
					>
						<Text style={styles.textStyle}>TouchableOpacity</Text>
					</TouchableOpacity>

					{/* Modal */}
					<View>
						<Button
							title="打开Modal窗口"
							color="#841584"
							onPress={openModalWin}
						/>
					</View>

					<Modal
						animationType='fade' // 指定了 modal 的动画类型。类型：slide 从底部滑入滑出|fade 淡入淡出|none 没有动画
						transparent={true} // 背景是否透明，默认为白色，当为true时表示背景为透明。
						visible={modalVisible} // 是否显示 modal 窗口
						onRequestClose={() => { closeModalWin() }} // 回调会在用户按下 Android 设备上的后退按键或是 Apple TV 上的菜单键时触发。请务必注意本属性在 Android 平台上为必填，且会在 modal 处于开启状态时阻止BackHandler事件
						onShow={() => { console.log('modal窗口显示了'); }} // 回调函数会在 modal 显示时调用
					>
						<View style={styles.modalLayer}>
							<View style={styles.modalContainer}>
								<Text style={styles.modalTitleStyle}>这是个Modal窗口！</Text>
								<View style={styles.modalButtonStyle}>
									<Button
										title='取消'
										color="#A4A4A4"
										onPress={closeModalWin}
									></Button>
								</View>
							</View>
						</View>
					</Modal>

					<View style={styles.imgWrapper}>

						{/* 渲染本地静态图片 */}
						<Image style={{ width: 100, height: 200 }} resizeMode='cover' source={require('../../src/assets/img/muse-logo2.jpg')} />
						{/* 渲染网络图片 */}
						<Image source={{ uri: 'http://www.helloui.net/assets/watch.jpg' }} />

					</View>

				</ScrollView>
			</View>
			/* </TouchableWithoutFeedback> */

		);
	});
};

export default TestView;
