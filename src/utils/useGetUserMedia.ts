import { useEffect, useState } from "react";

type ConstraintsType = {
  audio: boolean;
  video: boolean;
};

export const useGetUserMedia = (constraints: ConstraintsType) => {
  const [stream, setStream] = useState<MediaStream | null | undefined>();
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (stream) return;
    let didCancel = false;

    const getUserMedia = async () => {
      if (!didCancel) {
        try {
          setStream(await navigator.mediaDevices.getUserMedia(constraints));
        } catch (error) {
          setError(error as Error);
        }
      }
    };

    const cancel = () => {
      didCancel = true;
      if (!stream) return;
      if ((stream as MediaStream)?.getVideoTracks) {
        (stream as MediaStream).getVideoTracks().map((track) => track.stop());
      }
      if ((stream as MediaStream)?.getAudioTracks) {
        (stream as MediaStream).getAudioTracks().map((track) => track.stop());
      }
      // if (stream?.stop) {
      //   stream.stop();
      // }
    };
    getUserMedia();
    return cancel;
  }, [constraints, stream, error]);

  return { stream, error };
};
