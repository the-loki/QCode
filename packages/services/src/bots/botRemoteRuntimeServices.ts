import {
  ChannelClient,
  MessagePortProtocol,
  ProxyChannel,
  type MessagePortLike,
  type MessagePortPayload,
} from "@qcode/rpc";
import {
  IQCodeTaskService,
  type IQCodeTaskService as IQCodeTaskServiceShape,
} from "#src/session/qcodeTaskService.js";
import {
  IQCodeAgentService,
  type IQCodeAgentService as IQCodeAgentServiceShape,
} from "#src/qcode-agent/qcodeAgent.js";
import {
  IQCodeSessionService,
  type IQCodeSessionService as IQCodeSessionServiceShape,
} from "#src/qcode-session/qcodeSession.js";
import {
  IModelSelectionService,
  type IModelSelectionService as IModelSelectionServiceShape,
} from "#src/model-provider/providerFacadeServices.js";

interface PortLike {
  on?(event: "message", listener: (event: { data: MessagePortPayload }) => void): void;
  off?(event: "message", listener: (event: { data: MessagePortPayload }) => void): void;
  addEventListener?(
    event: "message",
    listener: (event: { data: MessagePortPayload }) => void,
  ): void;
  removeEventListener?(
    event: "message",
    listener: (event: { data: MessagePortPayload }) => void,
  ): void;
  postMessage(message: MessagePortPayload): void;
  start?(): void;
  close?(): void;
}

function toMessagePortLike(port: PortLike): MessagePortLike {
  return {
    addEventListener(type, listener) {
      if (port.addEventListener) {
        port.addEventListener(type, listener);
        return;
      }
      port.on?.(type, listener);
    },
    removeEventListener(type, listener) {
      if (port.removeEventListener) {
        port.removeEventListener(type, listener);
        return;
      }
      port.off?.(type, listener);
    },
    postMessage(data) {
      port.postMessage(data);
    },
    start() {
      port.start?.();
    },
    close() {
      port.close?.();
    },
  };
}

export interface RemoteBotWorkspaceRuntimeServices {
  qcodeAgentService: IQCodeAgentServiceShape;
  qcodeTaskService: IQCodeTaskServiceShape;
  qcodeSessionService: IQCodeSessionServiceShape;
  modelSelectionService: IModelSelectionServiceShape;
}

export function createRemoteRuntimeServicesFromPort(
  port: unknown,
): RemoteBotWorkspaceRuntimeServices {
  const protocol = new MessagePortProtocol(toMessagePortLike(port as PortLike));
  const client = new ChannelClient(protocol);
  return {
    qcodeAgentService: ProxyChannel.toService<IQCodeAgentServiceShape>(
      client.getChannel(IQCodeAgentService.channelName),
    ),
    qcodeTaskService: ProxyChannel.toService<IQCodeTaskServiceShape>(
      client.getChannel(IQCodeTaskService.channelName),
    ),
    qcodeSessionService: ProxyChannel.toService<IQCodeSessionServiceShape>(
      client.getChannel(IQCodeSessionService.channelName),
    ),
    modelSelectionService: ProxyChannel.toService<IModelSelectionServiceShape>(
      client.getChannel(IModelSelectionService.channelName),
    ),
  };
}
