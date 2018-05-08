import Vue from 'vue';
import Router from 'vue-router';
import CampaignList from '@/components/CampaignList';
import CreateCampaign from '@/components/CreateCampaign';
import Hello from '@/components/HelloWorld';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/account/:username',
      name: 'Campaigns',
      component: CampaignList
    },
    {
      path: '/campaigns/new/:username',
      name: 'CreateCampaign',
      component: CreateCampaign
    },
    {
      path: '/hello/',
      component: Hello
    }
  ],
  mode: 'history'
});
