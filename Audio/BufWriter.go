package main
import (
    "bytes"
	"errors"
	"io"
)


func New() *BufWriter {
	return &BufWriter{pos:0}
}

// WriterSeeker is an in-memory io.WriteSeeker implementation
type BufWriter struct {
	buf bytes.Buffer
	pos int
}

// Write writes to the buffer of this WriterSeeker instance
func (ws *BufWriter) Write(p []byte) (n int, err error) {
	// If the offset is past the end of the buffer, grow the buffer with null bytes.
	if extra := ws.pos - ws.buf.Len(); extra > 0 {
		if _, err := ws.buf.Write(make([]byte, extra)); err != nil {
			return n, err
		}
	}

	// If the offset isn't at the end of the buffer, write as much as we can.
	if ws.pos < ws.buf.Len() {
		n = copy(ws.buf.Bytes()[ws.pos:], p)
		p = p[n:]
	}

	// If there are remaining bytes, append them to the buffer.
	if len(p) > 0 {
		var bn int
		bn, err = ws.buf.Write(p)
		n += bn
	}

	ws.pos += n
	return n, err
}

// Seek seeks in the buffer of this WriterSeeker instance
func (ws *BufWriter) Seek(offset int64, whence int) (int64, error) {
	newPos, offs := 0, int(offset)
	switch whence {
	case io.SeekStart:
		newPos = offs
	case io.SeekCurrent:
		newPos = ws.pos + offs
	case io.SeekEnd:
		newPos = ws.buf.Len() + offs
	}
	if newPos < 0 {
		return 0, errors.New("negative result pos")
	}
	ws.pos = newPos
	return int64(newPos), nil
}

// Reader returns an io.Reader. Use it, for example, with io.Copy, to copy the content of the WriterSeeker buffer to an io.Writer
func (ws *BufWriter) Reader() io.Reader {
	return bytes.NewReader(ws.buf.Bytes())
}

// Close :
func (ws *BufWriter) Close() error {
	return nil
}

// BytesReader returns a *bytes.Reader. Use it when you need a reader that implements the io.ReadSeeker interface
func (ws *BufWriter) BytesReader() *bytes.Reader {
	return bytes.NewReader(ws.buf.Bytes())
}