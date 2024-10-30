import { useCallback, useState } from 'react';
import { Card, FloatButton, Form, message, Switch } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import PathSelect from './components/PathSelect';
import { BathRename, ZipFolder } from 'wailsjs/go/file/File';
import { file } from 'wailsjs/go/models';
import ManageTable from './components/ManageTable';
import { useSafeState } from 'ahooks';
import { Footer, Header, Page } from 'src/components';
import QuickPreview from './components/QuickPreview';
import './style/index.less';

function Home() {

	const [form] = Form.useForm();

	const [loading, setLoading] = useSafeState<boolean>(false);
	const [visible, setVisible] = useState<boolean>(false);

	function isImg(name: string) {
		const support = ['.png', '.jpg', '.webp', '.jpeg'];
		for (const suffix of support) {
			if (name.toLocaleLowerCase().endsWith(suffix)) {
				return true;
			}
		}
		return false;
	}

	function onFilesLoad(files: file.FileInfo[]) {
		form.setFieldsValue({
			images: files.filter(f => isImg(f.Name))
		});
	}

	const onQuickClick = useCallback((v: file.FileInfo) => {
		const target = document.querySelector(`[data-row-key="${v.Name}"]`);
		if (!target) return;
		setVisible(false);
		target.scrollIntoView({
			behavior: 'smooth',
			block: 'center'
		});
	}, []);

	function onPreview() {
		const images: file.FileInfo[] = form.getFieldValue('images') || [];
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
