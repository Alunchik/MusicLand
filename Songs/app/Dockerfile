FROM golang
WORKDIR /build
COPY . .
CMD sh -c './wait-for 172.25.0.2:5432 -- cmd'
RUN go mod download
RUN go build -o /main main.go
ENTRYPOINT ["/main"]
EXPOSE 8088