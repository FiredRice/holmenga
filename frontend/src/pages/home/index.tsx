import { useCallback, useEffect, useState } from 'react';
import { Card, FloatButton, Form, message, Switch } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import PathSelect from './components/PathSelect';
import { BathRename, ZipFolder } from 'wailsjs/go/file/File';
import { EventsOn, EventsOff } from 'wailsjs/runtime';
import ManageTable from './components/ManageTable';
import { useSafeState } from 'ahooks';
import { Footer, Header, Page } from 'src/components';
import QuickPreview from './components/QuickPreview';
import { FileInfo } from 'src/types';
import config from 'src/service/config';
import './style/index.less';

function Home() {

	const [form] = Form.useForm();

	const [loading, setLoading] = useSafeState<boolean>(false);
	const [visible, setVisible] = useState<boolean>(false);

	useEffect(() => {
		EventsOn('scroll-anim-chenge', function (v: boolean) {
			config.scrollAnim = v;
		});
		return () => {
			EventsOff('scroll-anim-chenge');
		};
	}, []);

	function isImg(name: string) {
		const support = ['.png', '.jpg', '.webp', '.jpeg'];
		for (const suffix of support) {
			if (name.toLocaleLowerCase().endsWith(suffix)) {
				return true;
			}
		}
		return false;
	}

	function onFilesLoad(files: FileInfo[]) {
		form.setFieldsValue({
			images: files.filter(f => isImg(f.Name))
		});
	}

	const onQuickClick = useCallback((v: FileInfo) => {
		const target = document.querySelector(`[data-row-key="${v.Name}"]`);
		if (!target) return;
		setVisible(false);
		/**
		 * 屮艸芔茻，鬼知道为啥不用 as 断言类型会报错啊
		 */
		target.scrollIntoView({
			behavior: config.scrollAnim ? 'smooth' : 'instant' as ScrollBehavior,
			block: 'center'
		});
	}, []);

	function onPreview() {
		const images: FileInfo[] = form.getFieldValue('images') || [];
		if (!images.length) {
			message.error('未找到图片');
			return;
		}
		setVisible(true);
	}

	async function onFinish(values) {
		const { dir, images = [], zip, remove } = values;
		if (!images.length) {
			message.error('未找到图片');
			return;
		}
		try {
			setLoading(true);
			await BathRename(images, dir);
			if (zip) {
				await ZipFolder({
					dir,
					remove
				});
			}
			setLoading(false);
			message.success('执行成功');
			form.resetFields(['images']);
		} catch (error) {
			setLoading(false);
			console.log(error);
		}
	}

	return (
		<Page>
			<Header>
				漫画处理
			</Header>
			<Card>
				<Form
					form={form}
					labelCol={{ sm: 5, md: 4 }}
					wrapperCol={{ sm: 16, md: 17 }}
					onFinish={onFinish}
				>
					<Form.Item
						label='自动压缩'
						name='zip'
						valuePropName='checked'
						initialValue={false}
					>
						<Switch
							checkedChildren='是'
							unCheckedChildren='否'
						/>
					</Form.Item>
					<Form.Item
						noStyle
						shouldUpdate={(prev, cur) => prev.zip !== cur.zip}
					>
						{({ getFieldValue }) => {
							const zip = getFieldValue('zip') ?? false;
							if (!zip) {
								return null;
							}
							return (
								<Form.Item
									label='压缩后自动删除'
									name='remove'
									valuePropName='checked'
									initialValue={false}
								>
									<Switch
										checkedChildren='是'
										unCheckedChildren='否'
									/>
								</Form.Item>
							);
						}}
					</Form.Item>
					<Form.Item
						label='文件夹'
						name='dir'
					>
						<PathSelect
							onLoadSuccess={onFilesLoad}
							onChange={() => form.resetFields(['images'])}
						>
							选择
						</PathSelect>
					</Form.Item>
					<Form.Item
						noStyle
						shouldUpdate={(pre, cur) => pre.dir !== cur.dir}
					>
						{({ getFieldValue }) => {
							const dir = getFieldValue('dir') || '';
							return (
								<Form.Item
									label='图片列表'
									initialValue={[]}
									name='images'
								>
									<ManageTable dir={dir} />
								</Form.Item>
							);
						}}
					</Form.Item>
					<QuickPreview
						open={visible}
						onItemClick={onQuickClick}
						onClose={() => setVisible(false)}
					/>
				</Form>
			</Card>
			<Footer>
				<Footer.Button
					type='primary'
					loading={loading}
					onClick={form.submit}
				>
					执行
				</Footer.Button>
			</Footer>
			<FloatButton
				className='quick-button'
				type='primary'
				icon={<SearchOutlined />}
				onClick={onPreview}
			/>
		</Page>
	);
}

export default Home;
