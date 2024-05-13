FROM golang
WORKDIR /build
COPY . .
RUN go mod download
RUN go build -o /main main.go
ENTRYPOINT ["/main"]
EXPOSE 5550