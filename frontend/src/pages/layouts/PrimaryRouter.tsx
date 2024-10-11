import { Suspense } from 'react';
import { Route } from 'react-router-dom';
import LodingCom from './LodingCom';
import { ChunkLazy } from 'src/utils';
import { FloatButton, Layout } from 'antd';
import './style/index.less';

const Home = ChunkLazy(() => import('../home'));

const PrimaryRoutes = () => {
    return (
        <Suspense fallback={<LodingCom />}>
            <Layout>
                <Layout.Content className='hm-layout'>
                    <Route path='/' exact component={Home} />
                </Layout.Content>
            </Layout>
            <FloatButton.BackTop
                className='hm-back-to-top'
                target={() => document.querySelector('#root') as HTMLElement}
            />
        </Suspense>
    );
};

export default PrimaryRoutes;