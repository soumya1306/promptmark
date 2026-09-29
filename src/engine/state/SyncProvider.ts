import * as Y from 'yjs';
import { IndexeddbPersistence } from 'y-indexeddb';
import { WebrtcProvider } from 'y-webrtc';
import { DocumentAst } from '../ast/schema';

/**
 * SyncProvider manages the Yjs CRDT document, handling offline persistence (IndexedDB)
 * and real-time multiplayer synchronization (WebRTC).
 */
export class SyncProvider {
  public doc: Y.Doc;
  private idbProvider: IndexeddbPersistence;
  private webrtcProvider: WebrtcProvider;

  // Emits when the Yjs Doc receives external changes (from network or DB load)
  public onRemoteUpdate?: () => void;

  constructor(roomName: string = 'wysiwyg-document-v1') {
    this.doc = new Y.Doc();

    // 1. Offline Persistence (Local First)
    this.idbProvider = new IndexeddbPersistence(roomName, this.doc);
    
    // Trigger update when IndexedDB finishes loading the offline document
    this.idbProvider.on('synced', () => {
      console.log("IndexedDB Synced");
      if (this.onRemoteUpdate) this.onRemoteUpdate();
    });

    // 2. Real-time Multiplayer (WebRTC)
    // Connects to public signaling servers to establish peer-to-peer connections
    this.webrtcProvider = new WebrtcProvider(roomName, this.doc);

    // Listen for remote changes
    this.doc.on('update', (update, origin) => {
      // Ignore local updates since we already rendered them
      if (origin !== this) {
        if (this.onRemoteUpdate) this.onRemoteUpdate();
      }
    });
  }

  /**
   * Retrieves the current AST from the Yjs shared map.
   * If it doesn't exist (new document), it initializes it with the fallback AST.
   */
  public getAst(fallbackAst: DocumentAst): DocumentAst {
    const ymap = this.doc.getMap('document_ast');
    const existingStr = ymap.get('json_data') as string;

    if (existingStr) {
      try {
        return JSON.parse(existingStr) as DocumentAst;
      } catch (e) {
        return fallbackAst;
      }
    } else {
      // First time initialization
      this.commitAst(fallbackAst);
      return fallbackAst;
    }
  }

  /**
   * Commits a mutated AST to the Yjs shared map, broadcasting it to peers and saving offline.
   * Note: In a production CRDT, we would map the AST deeply into Y.Array and Y.Map
   * to avoid full-string conflicts. For this engine skeleton, we replace the state.
   */
  public commitAst(ast: DocumentAst): void {
    const ymap = this.doc.getMap('document_ast');
    
    this.doc.transact(() => {
      ymap.set('json_data', JSON.stringify(ast));
    }, this); // Pass 'this' as origin to prevent echo loops
  }

  /**
   * Broadcasts a user's CaretPosition to other peers.
   */
  public broadcastCursor(clientId: string, x: number, y: number, height: number): void {
    const awareness = this.webrtcProvider.awareness;
    awareness.setLocalStateField('cursor', {
      id: clientId,
      x,
      y,
      height
    });
  }

  /**
   * Subscribes to peer cursor movements.
   */
  public onPeersChanged(callback: (states: any[]) => void): void {
    const awareness = this.webrtcProvider.awareness;
    awareness.on('change', () => {
      const states = Array.from(awareness.getStates().values());
      callback(states);
    });
  }

  public destroy(): void {
    this.webrtcProvider.destroy();
    this.idbProvider.destroy();
    this.doc.destroy();
  }
}
