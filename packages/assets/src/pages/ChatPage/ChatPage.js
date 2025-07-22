import {Layout, Page} from '@shopify/polaris';
import ChatContainer from '@assets/components/ChatContainer/ChatContainer';

const ChatPage = () => {
  return (
    // eslint-disable-next-line react/react-in-jsx-scope
    <Page title="Chat with ChadPT">
      {/* eslint-disable-next-line react/react-in-jsx-scope */}
      <Layout sectioned>
        {/* eslint-disable-next-line react/react-in-jsx-scope */}
        <ChatContainer />
      </Layout>
    </Page>
  );
};

export default ChatPage;
