import { DefaultChatProvider } from '@ant-design/x-sdk';
import { MockCodeReviewStream } from './mockStreaming';

export class CodeReviewChatProvider extends DefaultChatProvider<string, any, any> {
  constructor() {
    super({
      request: new MockCodeReviewStream('http://localhost', { manual: true }),
    });
  }

  transformMessage(info: any) {
    return (info.originMessage || '') + info.chunk.data;
  }

  transformLocalMessage(params: any) {
    return params.message;
  }

  transformParams(params: any) {
    return params;
  }
}
